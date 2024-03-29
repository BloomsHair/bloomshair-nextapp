import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const AreaChartComponent = ({
  data,
}: {
  data: { date: string; totalPrice: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area
          dataKey="totalPrice"
          type="monotone"
          fill="#bef8fd"
          stroke="#2cb1bc"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
