"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { Button } from "@/components/ui/button";
import { RotateCw, AlignStartHorizontal, AlignStartVertical } from "lucide-react";

// 定义时间线事件类型
interface TimelineEvent {
  id: string | number;
  time: string;
  title: string;
  description: string;
  color: string;
  size: number;
}

interface TimelineCanvasProps {
  timelineEvents: TimelineEvent[];
}

export default function TimelineCanvas({ timelineEvents }: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [isVerticalLayout, setIsVerticalLayout] = useState<boolean>(false);

  // 检测设备屏幕宽度，设置初始布局方向
  useEffect(() => {
    const checkScreenSize = () => {
      // 移动端默认竖屏显示，桌面端默认横屏显示
      // 使用768px作为移动设备和桌面设备的分界点
      const isMobile = window.innerWidth < 768;
      setIsVerticalLayout(isMobile);
    };

    // 组件挂载时检测屏幕宽度
    checkScreenSize();

    // 添加窗口大小变化的监听器
    window.addEventListener("resize", checkScreenSize);

    // 组件卸载时清理监听器
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleReset = () => {
    if (cameraRef.current && controlsRef.current) {
      // 重置相机位置
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();

      // 清除选中状态
      setHoveredEvent(null);

      // 移除所有事件详情弹窗
      const dialogs = document.querySelectorAll(".event-detail-dialog");
      dialogs.forEach(dialog => {
        document.body.removeChild(dialog);
      });

      // 恢复所有标签的显示状态
      const labels = document.querySelectorAll(".timeline-label");
      labels.forEach(label => {
        (label as HTMLElement).style.visibility = "visible";
      });

      // 重置鼠标样式
      document.body.style.cursor = "default";
    }
  };

  const toggleLayout = () => {
    // 手动切换布局方向
    setIsVerticalLayout(!isVerticalLayout);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkTheme ? 0x111111 : 0xffffff); // 根据主题设置背景色

    // 设置相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
    // 根据布局设置相机位置
    if (isVerticalLayout) {
      camera.position.set(0, 5, 5);
    } else {
      camera.position.z = 5;
    }
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 创建CSS2D渲染器
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    canvasRef.current.parentElement?.appendChild(labelRenderer.domElement);
    labelRendererRef.current = labelRenderer;

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // 添加环境光和平行光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 使用传入的时间线数据，提前获取以便计算时间间隔

    // 计算时间范围
    const startDate = new Date(timelineEvents[0].time);
    const endDate = new Date(timelineEvents[timelineEvents.length - 1].time);
    const timeRange = endDate.getTime() - startDate.getTime();

    // 创建螺旋曲线路径
    const curvePoints = [];
    const spiralLength = 15; // 螺旋长度
    const spiralRadius = 0.3; // 螺旋半径
    const spiralTurns = 5; // 螺旋圈数
    const segmentCount = 500; // 大幅增加分段数量，使曲线更平滑

    // 计算每个事件的实际时间位置，用于后续曲线点的分布
    const eventTimePositions = timelineEvents.map(event => {
      const eventDate = new Date(event.time);
      // 在垂直布局时，反转时间位置，使最新的事件（时间较大的）显示在底部
      if (isVerticalLayout) {
        return 1 - (eventDate.getTime() - startDate.getTime()) / timeRange;
      } else {
        return (eventDate.getTime() - startDate.getTime()) / timeRange;
      }
    });

    for (let i = 0; i <= segmentCount; i++) {
      const t = i / segmentCount;
      // 参数方程创建螺旋曲线
      const angle = t * Math.PI * 2 * spiralTurns;
      // 螺旋半径随着轴位置略微变化，使螺旋更有动感
      const radius = spiralRadius * (1 + 0.2 * Math.sin(t * Math.PI * 3));

      if (isVerticalLayout) {
        // 垂直布局：主轴是Y轴
        const y = (t - 0.5) * spiralLength;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        curvePoints.push(new THREE.Vector3(x, y, z));
      } else {
        // 水平布局：主轴是X轴
        const x = (t - 0.5) * spiralLength;
        const y = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        curvePoints.push(new THREE.Vector3(x, y, z));
      }
    }

    // 创建平滑曲线
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    // 设置曲线张力为0.1，使曲线更平滑（默认为0.5，值越小曲线越平滑）
    curve.tension = 0.1;
    // 创建管状几何体
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      500, // 大幅增加分段数，使曲线更平滑
      0.05, // 管径
      36, // 增加管截面分段数，使管道更圆滑
      false, // 是否闭合
    );

    // 创建自定义着色器材质
    const tubeMaterial = new THREE.MeshPhysicalMaterial({
      color: isDarkTheme ? 0x6366f1 : 0x4f46e5, // 基础颜色
      metalness: 0.3, // 增加金属度
      roughness: 0.05, // 降低粗糙度使其更光滑
      transparent: true, // 启用透明
      opacity: 0.8, // 增加透明度
      side: THREE.DoubleSide, // 双面渲染
      clearcoat: 1.0, // 清漆涂层
      clearcoatRoughness: 0.05, // 降低清漆粗糙度
      transmission: 0.2, // 透射率
      thickness: 0.5, // 厚度
      emissive: isDarkTheme ? 0x3730a3 : 0x4338ca,
      emissiveIntensity: 0.5, // 增加自发光强度
    });

    // 创建管状网格
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);

    // 添加点光源增强发光效果
    const pointLight = new THREE.PointLight(0x6366f1, 2, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // 创建时间线事件球体
    const eventSpheres: THREE.Mesh[] = [];
    const eventMaterials: THREE.Material[] = [];
    const eventLabels: CSS2DObject[] = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 为每个事件创建球体，使用之前计算的eventTimePositions
    timelineEvents.forEach((event, index) => {
      // 使用之前计算的时间位置
      const eventPosition = eventTimePositions[index];

      // 计算在螺旋曲线上的位置
      const t = eventPosition;
      const curvePoint = curve.getPointAt(t);

      // 创建球体几何体，大小根据事件的size属性
      const sphereGeometry = new THREE.SphereGeometry(0.1 * event.size, 32, 32);

      // 解析颜色
      const color = new THREE.Color(event.color);

      // 创建发光材质
      const sphereMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        emissive: color.clone().multiplyScalar(0.5),
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });

      // 创建球体网格
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(curvePoint);
      sphere.userData = { event }; // 存储事件数据

      // 创建标签显示时间和标题
      const labelDiv = document.createElement("div");
      labelDiv.className = "timeline-label";
      labelDiv.style.backgroundColor = isDarkTheme
        ? "rgba(17, 24, 39, 0.8)"
        : "rgba(255, 255, 255, 0.8)";
      labelDiv.style.color = isDarkTheme ? "#fff" : "#000";
      labelDiv.style.padding = "4px 8px";
      labelDiv.style.borderRadius = "4px";
      labelDiv.style.fontSize = "12px";
      labelDiv.style.fontWeight = "bold";
      labelDiv.style.pointerEvents = "auto";
      labelDiv.style.textAlign = "center";
      labelDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      labelDiv.style.border = `1px solid ${event.color}`;
      labelDiv.style.transform = "translate(-50%, -100%)";
      labelDiv.style.marginBottom = "8px";
      labelDiv.style.opacity = "0";
      labelDiv.style.transition = "opacity 0.3s ease";
      labelDiv.style.cursor = "pointer";

      // 计算标签的显示层级，避免重叠
      // 根据索引的奇偶性交错显示标签位置
      const yOffset = 0.15 * event.size * (1 + (index % 3) * 0.8);
      // 根据事件大小调整标签显示
      const shouldShowLabel = event.size >= 0.9 || index % 3 === 0;

      // 只显示标题，点击时显示详细信息
      if (shouldShowLabel) {
        // 格式化日期显示
        const eventDate = new Date(event.time);
        const formattedDate = eventDate.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        labelDiv.innerHTML = `
                    <div style="font-weight: bold;">${event.title}</div>
                    <div style="font-size: 10px; margin-top: 2px; color: ${isDarkTheme ? "#a1a1aa" : "#71717a"};">${formattedDate}</div>
                `;
        // 增加一点padding以适应更多内容
        labelDiv.style.padding = "6px 8px";
      } else {
        // 对于较小的事件或者密集区域的事件，只显示一个小点标记
        labelDiv.innerHTML = `<div style="width: 6px; height: 6px; background-color: ${event.color}; border-radius: 50%; margin: 0 auto;"></div>`;
        labelDiv.style.padding = "2px";
        labelDiv.style.backgroundColor = "transparent";
        labelDiv.style.border = "none";
        labelDiv.style.boxShadow = "none";
      }

      // 添加点击事件处理
      labelDiv.addEventListener("click", () => {
        const dialogRoot = document.createElement("div");
        dialogRoot.innerHTML = `
                    <div class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                        <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg">
                            <button class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <div class="flex flex-col space-y-1.5 text-center sm:text-left">
                                <h3 class="text-lg font-semibold leading-none tracking-tight">${event.title}</h3>
                                <p class="text-sm text-muted-foreground">${event.time}</p>
                            </div>
                            <p>${event.description}</p>
                        </div>
                    </div>
                `;

        document.body.appendChild(dialogRoot);

        // 添加关闭按钮事件
        const closeButton = dialogRoot.querySelector("button");
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            document.body.removeChild(dialogRoot);
          });
        }

        // 点击背景关闭对话框
        const overlay = dialogRoot.querySelector(".fixed.inset-0");
        if (overlay) {
          overlay.addEventListener("click", e => {
            if (e.target === overlay) {
              document.body.removeChild(dialogRoot);
            }
          });
        }
      });

      // 创建CSS2D对象
      const eventLabel = new CSS2DObject(labelDiv);
      eventLabel.position.copy(curvePoint);
      // 将标签位置调整，避免与球体重叠，并根据索引交错显示
      eventLabel.position.y += yOffset;

      scene.add(eventLabel);
      eventLabels.push(eventLabel);

      // 延迟显示标签，创建淡入效果
      setTimeout(() => {
        labelDiv.style.opacity = shouldShowLabel ? "1" : "0.7";
      }, 100 * index);

      // 如果不是第一个事件，可以添加连接线来更明显地表示时间间隔
      if (index > 0) {
        const prevEventPosition = eventTimePositions[index - 1];
        const prevCurvePoint = curve.getPointAt(prevEventPosition);

        // 计算两个事件之间的实际时间差（以天为单位）
        const currentDate = new Date(event.time);
        const prevDate = new Date(timelineEvents[index - 1].time);
        const daysDiff = Math.round(
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        // 创建一个小标签显示时间间隔
        if (daysDiff > 30) {
          // 只显示超过一个月的间隔
          // 计算标签位置（两点之间）
          const midPoint = new THREE.Vector3()
            .addVectors(curvePoint, prevCurvePoint)
            .multiplyScalar(0.5);

          // 创建一个小球作为标记
          const markerGeometry = new THREE.SphereGeometry(0.03, 16, 16);
          const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
          });
          const marker = new THREE.Mesh(markerGeometry, markerMaterial);
          marker.position.copy(midPoint);
          marker.userData = { timeGap: `${daysDiff}天` };
          scene.add(marker);
        }
      }

      scene.add(sphere);
      eventSpheres.push(sphere);
      eventMaterials.push(sphereMaterial);
    });

    // 处理窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (labelRendererRef.current) {
        labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    // 处理鼠标移动，用于检测悬停在球体或时间间隔标记上
    const handleMouseMove = (event: MouseEvent) => {
      // 计算鼠标在归一化设备坐标中的位置
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 设置射线
      raycaster.setFromCamera(mouse, camera);

      // 获取所有可交互对象（事件球体和时间间隔标记）
      const allInteractiveObjects = scene.children.filter(
        child =>
          child instanceof THREE.Mesh &&
          child.userData &&
          (child.userData.event || child.userData.timeGap),
      );

      // 检测射线与对象的交叉
      const intersects = raycaster.intersectObjects(allInteractiveObjects);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        if (intersectedObject.userData.event) {
          // 悬停在事件球体上
          const eventData = intersectedObject.userData.event as TimelineEvent;
          setHoveredEvent(eventData);
          document.body.style.cursor = "pointer";
        } else if (intersectedObject.userData.timeGap) {
          // 悬停在时间间隔标记上
          setHoveredEvent({
            id: -1, // 使用特殊ID表示这是时间间隔
            time: "",
            title: "时间间隔",
            description: intersectedObject.userData.timeGap,
            color: "#ffffff",
            size: 1,
          });
          document.body.style.cursor = "pointer";
        }
      } else {
        setHoveredEvent(null);
        document.body.style.cursor = "default";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 处理键盘事件
    let currentFocusIndex = -1;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Tab" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setHoveredEvent(null);
        // 清除所有标签的显示
        eventLabels.forEach(label => {
          (label.element as HTMLDivElement).style.visibility = "hidden";
        });

        // 更新当前焦点索引
        if (
          event.key === "ArrowRight" ||
          event.key === "ArrowDown" ||
          (event.key === "Tab" && !event.shiftKey)
        ) {
          currentFocusIndex = (currentFocusIndex + 1) % eventSpheres.length;
        } else if (
          event.key === "ArrowLeft" ||
          event.key === "ArrowUp" ||
          (event.key === "Tab" && event.shiftKey)
        ) {
          currentFocusIndex = (currentFocusIndex - 1 + eventSpheres.length) % eventSpheres.length;
        }

        // 获取当前焦点的事件球体
        const focusedSphere = eventSpheres[currentFocusIndex];
        if (focusedSphere && focusedSphere.userData.event) {
          const eventData = focusedSphere.userData.event as TimelineEvent;

          // 只显示当前焦点的标签
          const label = eventLabels[currentFocusIndex];
          if (label) {
            (label.element as HTMLDivElement).style.visibility = "visible";
          }

          // 移动相机到小球位置
          moveCamera(focusedSphere.position.clone());

          // 创建点击波纹效果
          createClickRipple(focusedSphere.position.clone(), eventData.color);

          // 放大动画效果
          const originalScale = focusedSphere.scale.clone();
          const targetScale = originalScale.clone().multiplyScalar(2.0);
          animateScale(focusedSphere, originalScale, targetScale, 300, () => {
            animateScale(focusedSphere, targetScale, originalScale, 300);
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // 处理鼠标点击事件
    const moveCamera = (targetPosition: THREE.Vector3) => {
      // 保存当前相机位置和目标位置
      const startPosition = camera.position.clone();
      const startLookAt = controls.target.clone();

      // 计算新的相机位置，保持相同的距离但对准目标
      const distance = 5; // 保持一定距离
      const direction = new THREE.Vector3()
        .subVectors(camera.position, controls.target)
        .normalize();
      const endPosition = targetPosition.clone().add(direction.multiplyScalar(distance));

      // 动画参数
      const duration = 1000; // 动画持续时间（毫秒）
      const startTime = Date.now();

      // 执行相机移动动画
      const animateCamera = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // 使用缓动函数使动画更平滑
        const easedProgress = easeInOutCubic(progress);

        // 计算当前相机位置
        const currentPosition = new THREE.Vector3().lerpVectors(
          startPosition,
          endPosition,
          easedProgress,
        );
        camera.position.copy(currentPosition);

        // 计算当前目标位置
        const currentTarget = new THREE.Vector3().lerpVectors(
          startLookAt,
          targetPosition,
          easedProgress,
        );
        controls.target.copy(currentTarget);
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        }
      };

      animateCamera();
    };

    const handleMouseClick = (event: MouseEvent) => {
      // 计算鼠标在归一化设备坐标中的位置
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 设置射线
      raycaster.setFromCamera(mouse, camera);

      // 获取所有可交互对象（事件球体和时间间隔标记）
      const allInteractiveObjects = scene.children.filter(
        child =>
          child instanceof THREE.Mesh &&
          child.userData &&
          (child.userData.event || child.userData.timeGap),
      );

      // 检测射线与对象的交叉
      const intersects = raycaster.intersectObjects(allInteractiveObjects);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;

        if (intersectedObject.userData.event) {
          // 点击事件球体
          const eventData = intersectedObject.userData.event as TimelineEvent;

          // 清除所有标签的显示
          eventLabels.forEach(label => {
            (label.element as HTMLDivElement).style.visibility = "hidden";
          });

          // 找到点击的球体索引并更新当前焦点
          const clickedIndex = eventSpheres.findIndex(sphere => sphere === intersectedObject);
          if (clickedIndex !== -1) {
            currentFocusIndex = clickedIndex;

            // 只显示当前焦点的标签
            const label = eventLabels[currentFocusIndex];
            if (label) {
              (label.element as HTMLDivElement).style.visibility = "visible";
            }
          }

          // 创建点击波纹效果
          createClickRipple(intersectedObject.position.clone(), eventData.color);

          // 放大动画效果
          const originalScale = intersectedObject.scale.clone();
          const targetScale = originalScale.clone().multiplyScalar(2.0);

          // 执行放大动画
          animateScale(intersectedObject, originalScale, targetScale, 300, () => {
            // 放大后恢复原始大小
            animateScale(intersectedObject, targetScale, originalScale, 300);
          });

          // 移动相机到小球位置
          moveCamera(intersectedObject.position.clone());

          // 显示详细信息弹窗
          // setTimeout(() => {
          //     showEventDetailDialog(eventData);
          // }, 350);
        }
      }
    };

    // 创建点击波纹效果
    const createClickRipple = (position: THREE.Vector3, color: string) => {
      // 创建一个环形几何体作为波纹
      const rippleGeometry = new THREE.RingGeometry(0.1, 0.12, 32);
      const rippleMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });

      const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
      ripple.position.copy(position);
      // 使波纹面向相机
      ripple.lookAt(camera.position);
      scene.add(ripple);

      // 波纹动画
      const startTime = Date.now();
      const duration = 1000; // 1秒动画

      const animateRipple = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // 扩大波纹
        const scale = 1 + progress * 3;
        ripple.scale.set(scale, scale, scale);

        // 降低不透明度
        rippleMaterial.opacity = 0.8 * (1 - progress);

        if (progress < 1) {
          requestAnimationFrame(animateRipple);
        } else {
          // 动画结束，移除波纹
          scene.remove(ripple);
          rippleGeometry.dispose();
          rippleMaterial.dispose();
        }
      };

      animateRipple();
    };

    // 缩放动画辅助函数
    const animateScale = (
      object: THREE.Object3D,
      startScale: THREE.Vector3,
      endScale: THREE.Vector3,
      duration: number,
      callback?: () => void,
    ) => {
      const startTime = Date.now();

      const updateScale = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // 使用缓动函数使动画更平滑
        const easedProgress = easeInOutCubic(progress);

        // 计算当前缩放值
        const currentScale = new THREE.Vector3().lerpVectors(startScale, endScale, easedProgress);
        object.scale.copy(currentScale);

        if (progress < 1) {
          requestAnimationFrame(updateScale);
        } else if (callback) {
          callback();
        }
      };

      updateScale();
    };

    // 缓动函数
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    window.addEventListener("click", handleMouseClick);

    // 动画参数
    let time = 0;

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.005; // 减慢动画速度

      // 更新点光源位置
      pointLight.position.x = Math.sin(time * 0.5) * 3;
      pointLight.position.y = Math.cos(time * 0.3) * 2;

      // 更新管道纹理动画
      tubeMaterial.emissiveIntensity = (Math.sin(time * 0.5) + 1.2) * 0.4;

      // 更新曲线点的位置，使螺旋呈现动态效果
      curvePoints.forEach((point, i) => {
        const t = i / segmentCount;
        const angle = t * Math.PI * 2 * spiralTurns + time;
        // 动态调整螺旋半径
        const dynamicRadius = spiralRadius * (1 + 0.3 * Math.sin(t * Math.PI * 3 + time));

        if (isVerticalLayout) {
          // 垂直布局：保持Y轴作为主轴，更新X和Z
          point.x = Math.sin(angle) * dynamicRadius;
          point.z = Math.cos(angle) * dynamicRadius;
        } else {
          // 水平布局：保持X轴作为主轴，更新Y和Z
          point.y = Math.sin(angle) * dynamicRadius;
          point.z = Math.cos(angle) * dynamicRadius;
        }
      });

      // 更新曲线
      curve.points = curvePoints;

      // 更新管道几何体
      const newTubeGeometry = new THREE.TubeGeometry(
        curve,
        300, // 分段数
        0.05, // 管径
        36, // 管截面分段数
        false,
      );

      // 替换旧的几何体
      tube.geometry.dispose();
      tube.geometry = newTubeGeometry;

      // 更新球体位置，使其跟随曲线动态变化，同时保持时间间隔
      timelineEvents.forEach((event, index) => {
        if (index < eventSpheres.length) {
          // 使用之前计算的时间位置，确保保持时间间隔
          const eventPosition = eventTimePositions[index];

          // 获取更新后的曲线上的点
          const curvePoint = curve.getPointAt(eventPosition);

          // 更新球体位置
          eventSpheres[index].position.copy(curvePoint);

          // 更新标签位置
          if (index < eventLabels.length) {
            eventLabels[index].position.copy(curvePoint);
            // 计算标签的显示层级，避免重叠
            // 根据索引的奇偶性交错显示标签位置
            const yOffset = 0.15 * event.size * (1 + (index % 3) * 0.8);
            // 将标签位置调整，避免与球体重叠，并根据索引交错显示
            eventLabels[index].position.y += yOffset;
          }

          // 添加轻微的脉动效果
          const pulseFactor = 1 + 0.05 * Math.sin(time * 2 + index);
          eventSpheres[index].scale.set(pulseFactor, pulseFactor, pulseFactor);

          // 更新材质发光强度
          if (eventMaterials[index] instanceof THREE.MeshPhysicalMaterial) {
            const material = eventMaterials[index] as THREE.MeshPhysicalMaterial;
            material.emissiveIntensity = 0.5 + 0.2 * Math.sin(time * 3 + index * 0.5);
          }

          // 更新时间间隔标记的位置（如果存在）
          if (index > 0) {
            const prevEventPosition = eventTimePositions[index - 1];
            const prevCurvePoint = curve.getPointAt(prevEventPosition);

            // 查找并更新时间间隔标记
            scene.children.forEach(child => {
              if (child instanceof THREE.Mesh && child.userData && child.userData.timeGap) {
                // 计算新的中点位置
                const midPoint = new THREE.Vector3()
                  .addVectors(curvePoint, prevCurvePoint)
                  .multiplyScalar(0.5);
                child.position.copy(midPoint);
              }
            });
          }
        }
      });

      // 缓慢旋转场景
      scene.rotation.y = Math.sin(time * 0.1) * 0.1;

      controls.update();
      renderer.render(scene, camera);
      // 渲染CSS2D标签
      if (labelRendererRef.current) {
        labelRendererRef.current.render(scene, camera);
      }
    };
    animate();

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
      window.removeEventListener("keydown", handleKeyDown);
      renderer.dispose();
      tubeGeometry.dispose();
      tubeMaterial.dispose();

      // 清理球体资源
      eventSpheres.forEach(sphere => {
        sphere.geometry.dispose();
      });
      eventMaterials.forEach(material => {
        if (material instanceof THREE.Material) {
          material.dispose();
        }
      });

      // 移除CSS2D渲染器
      if (labelRendererRef.current) {
        canvasRef.current?.parentElement?.removeChild(labelRendererRef.current.domElement);
      }
      scene.clear();
      // 移除所有可能存在的事件详情弹窗
      const dialogs = document.querySelectorAll(".event-detail-dialog");
      dialogs.forEach(dialog => {
        document.body.removeChild(dialog);
      });
    };
  }, [isDarkTheme, isVerticalLayout]); // 添加theme和isVerticalLayout作为依赖，当主题或布局变化时重新渲染

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="flex-1"></canvas>
      <Button
        onClick={handleReset}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4 z-10 transition-all duration-300 hover:bg-primary/10"
      >
        <RotateCw />
      </Button>
      <Button
        onClick={toggleLayout}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-16 z-10 transition-all duration-300 hover:bg-primary/10"
        title={isVerticalLayout ? "切换到水平布局" : "切换到垂直布局"}
      >
        {isVerticalLayout ? <AlignStartHorizontal /> : <AlignStartVertical />}
      </Button>
      {hoveredEvent && (
        <div className="absolute right-4 top-4 z-10 max-w-xs rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-1 text-lg font-bold">{hoveredEvent.title}</h3>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{hoveredEvent.time}</p>
          <p className="text-sm">{hoveredEvent.description}</p>
        </div>
      )}
    </div>
  );
}
