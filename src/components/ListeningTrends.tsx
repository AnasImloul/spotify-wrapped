import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Calendar } from 'lucide-react';
import { useFilteredStats } from '@/hooks';

export function ListeningTrends() {
  const stats = useFilteredStats();
  
  if (!stats || !stats.listeningByMonth || stats.listeningByMonth.length === 0) {
    return null;
  }

  const monthlyData = stats.listeningByMonth.map((item) => ({
    month: new Date(item.month + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    }),
    minutes: Math.round(item.minutes),
  }));

  return (
    <Card className="overflow-hidden border-green-500/30">
      <CardHeader className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-b border-green-500/20">
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="w-5 h-5 text-green-400" />
          Listening Trends Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
                stroke="rgba(255, 255, 255, 0.2)"
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
                stroke="rgba(255, 255, 255, 0.2)"
                label={{
                  value: 'Minutes',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: 'rgba(255, 255, 255, 0.6)' },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 30, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                }}
                labelStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
                itemStyle={{ color: '#1DB954' }}
                formatter={(value: number) => [`${value} min`, 'Listening Time']}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#1DB954"
                strokeWidth={3}
                dot={{ fill: '#1DB954', r: 4 }}
                activeDot={{ r: 6, fill: '#1ed760' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

