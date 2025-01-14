import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function BooksSelector({ sort, setSort, filter, setFilter }) {
  return (
    <div className="hidden gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>状态</SelectLabel>
            <SelectItem value="all">全部书籍</SelectItem>
            <SelectItem value="reading">在读</SelectItem>
            <SelectItem value="finished">已读完</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="排序方式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">最近阅读</SelectItem>
          <SelectItem value="progress">阅读进度</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
