const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  try {
    // 读取timeline.json文件
    const timelineData = fs.readFileSync(
      path.join(process.cwd(), "src", "mockup", "timeline.json"),
      "utf-8",
    );

    const timelineItems = JSON.parse(timelineData);

    console.log(`准备导入 ${timelineItems.length} 条时间轴数据...`);

    // 清空现有Timeline数据（可选）
    await prisma.timeline.deleteMany({});

    // 批量插入数据
    const result = await Promise.all(
      timelineItems.map(async item => {
        return prisma.timeline.create({
          data: {
            time: item.time,
            title: item.title,
            description: item.description,
            color: item.color,
            size: item.size,
          },
        });
      }),
    );

    console.log(`成功导入 ${result.length} 条时间轴数据`);
  } catch (error) {
    console.error("导入时间轴数据时出错:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
