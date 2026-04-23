// 在你的页面中使用
import PeopleTrendChart from "../../components/PeopleTrendChart/PeopleTrendChart"

export default function MonthPeople() {
  return (
    <div>
      <h2>人力投入趋势</h2>
      <PeopleTrendChart 
        apiUrl="http://localhost:3001/api/people-trend"
        defaultYear={2026}
        defaultType="month"
        height={400}
        debounceDelay={500}
      />
    </div>
  )
}