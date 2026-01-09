import { useState, useRef, useEffect } from "react";
import { Input, Button } from "antd";
import { LeftOutlined, RightOutlined, DownOutlined } from "@ant-design/icons";
import "./index.scss";

export interface PaginationProps {
  /** 当前页码 */
  current: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
  /** 每页条数选项 */
  pageSizeOptions?: string[];
  /** 页码改变的回调 */
  onChange?: (page: number, pageSize: number) => void;
  /** 每页条数改变的回调 */
  onPageSizeChange?: (current: number, size: number) => void;
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean;
  /** 是否显示总条数 */
  showTotal?: boolean;
}

export default function Pagination({
  current,
  pageSize,
  total,
  pageSizeOptions = ["10", "15", "20", "50", "100"],
  onChange,
  onPageSizeChange,
  showQuickJumper = true,
  showTotal = true,
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize) || 1;

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // 处理页码改变
  const handlePageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    onChange?.(page, pageSize);
  };

  // 处理每页条数改变
  const handlePageSizeChange = (size: number) => {
    // 计算新页码，保持当前显示的第一条数据在新分页中的位置
    const newPage = Math.floor(((current - 1) * pageSize) / size) + 1;
    setDropdownOpen(false);
    onPageSizeChange?.(newPage, size);
  };

  // 处理快速跳转
  const handleJump = () => {
    const page = parseInt(jumpPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpPage("");
    }
  };

  // 处理跳转输入框回车
  const handleJumpKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJump();
    }
  };

  return (
    <div className="custom-pagination">
      {/* 总条数 */}
      {showTotal && (
        <span className="pagination-total">共 {total} 条</span>
      )}

      {/* 每页条数选择器 */}
      <div className="pagination-size-changer" ref={dropdownRef}>
        <div
          className={`size-select ${dropdownOpen ? "open" : ""}`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="size-select-value">{pageSize}条/页</span>
          <DownOutlined className="size-select-arrow" />
        </div>
        {dropdownOpen && (
          <div className="size-select-dropdown">
            {pageSizeOptions.map((option) => (
              <div
                key={option}
                className={`size-select-option ${
                  pageSize.toString() === option ? "selected" : ""
                }`}
                onClick={() => handlePageSizeChange(Number(option))}
              >
                {option}条/页
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 上一页按钮 */}
      <Button
        className="pagination-prev"
        icon={<LeftOutlined />}
        disabled={current === 1}
        onClick={() => handlePageChange(current - 1)}
      />

      {/* 当前页显示 */}
      <Button
        className="pagination-current"
        disabled
      >
        {current}
      </Button>

      {/* 下一页按钮 */}
      <Button
        className="pagination-next"
        icon={<RightOutlined />}
        disabled={current >= totalPages}
        onClick={() => handlePageChange(current + 1)}
      />

      {/* 快速跳转 */}
      {showQuickJumper && (
        <div className="pagination-jumper">
          <span className="jumper-label">前往</span>
          <Input
            className="jumper-input"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyPress={handleJumpKeyPress}
            placeholder=""
          />
          <span className="jumper-label">页</span>
        </div>
      )}
    </div>
  );
}

