import { TextSelection } from "@tiptap/pm/state";
import clsx from "clsx";
export const ToCItem = ({ item, onItemClick }) => {
  return (
    <div
      className={clsx("block text-muted-foreground transition-colors hover:text-foreground", "", {
        "bg-primary/20": item.isActive && !item.isScrolledOver,
        "text-muted": item.isScrolledOver,
        "pl-2": item.level === 2,
        "pl-4": item.level === 3,
      })}
    >
      <a
        href={`#${item.id}`}
        onClick={e => onItemClick(e, item.id)}
        data-item-index={item.itemIndex}
      >
        {item.textContent}
      </a>
    </div>
  );
};

export const ToCEmptyState = () => {
  return <p className="italic text-muted-foreground">暂无目录内容</p>;
};

export const ToC = ({ items = [], editor }) => {
  if (items.length === 0) {
    return <ToCEmptyState />;
  }

  const onItemClick = (e, id) => {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);
      const pos = editor.view.posAtDOM(element, 0);

      // set focus
      const tr = editor.view.state.tr;

      tr.setSelection(new TextSelection(tr.doc.resolve(pos)));

      editor.view.dispatch(tr);

      editor.view.focus();

      if (history.pushState) {
        // eslint-disable-line
        history.pushState(null, null, `#${id}`); // eslint-disable-line
      }

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 60,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <nav className={"space-y-2 text-sm"}>
        <p className="mb-4 font-medium">目录</p>
        <div className="space-y-2">
          {items.map(item => (
            <ToCItem onItemClick={onItemClick} key={item.id} item={item} />
          ))}
        </div>
      </nav>
    </>
  );
};
