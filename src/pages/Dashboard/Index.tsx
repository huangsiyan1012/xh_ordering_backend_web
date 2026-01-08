import "./dashboard.scss";

const summaryCards = [
  { title: "今日订单", value: 128, unit: "单" },
  { title: "今日积分消耗", value: 3560, unit: "分" },
  { title: "新增用户", value: 12, unit: "人" },
  { title: "上架菜品", value: 68, unit: "道" },
];

const recentOrders = [
  { id: "20251207001", user: "张三", points: 120, time: "10:32" },
  { id: "20251207002", user: "李四", points: 80, time: "11:05" },
  { id: "20251207003", user: "王五", points: 150, time: "12:18" },
  { id: "20251207004", user: "赵六", points: 60, time: "13:47" },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.title} className="summary-card">
            <div className="summary-title">{card.title}</div>
            <div className="summary-value">
              {card.value}
              <span className="unit">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">最新订单</div>
        </div>
        <div className="panel-body">
          <table className="simple-table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>用户</th>
                <th>积分</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.user}</td>
                  <td>{o.points}</td>
                  <td>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

