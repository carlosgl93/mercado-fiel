// import { Text, Title } from '@/components/StyledComponents';
import React from 'react';
// import { TooltipProps } from 'recharts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  // Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComunaCount {
  [key: string]: number;
  total: number;
}

interface Props {
  providersPerComunaCount: {
    name: string;
    count: ComunaCount;
  }[];
  usersPerComunaCount: {
    name: string;
    count: ComunaCount;
  }[];
}

// const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908'];

export const UsuariosPrestadoresPorComunaGraph: React.FC<Props> = ({
  providersPerComunaCount = [],
  usersPerComunaCount = [],
}) => {
  console.log('providers, users', { providersPerComunaCount, usersPerComunaCount });

  const series = providersPerComunaCount.map((p) => ({
    name: p.name,
    data: [
      {
        category: 'Soporte Terapéutico',
        value: p.count['Soporte Terapéutico'] || 0,
        total:
          p.count.total + (usersPerComunaCount.find((u) => u.name === p.name)?.count.total || 0),
        prestadores: p.count.total,
        usuarios: usersPerComunaCount.find((u) => u.name === p.name)?.count.total || 0,
      },
      {
        category: 'Cuidadora',
        value: p.count.Cuidadora || 0,
        total:
          p.count.total + (usersPerComunaCount.find((u) => u.name === p.name)?.count.total || 0),
        prestadores: p.count.total,
        usuarios: usersPerComunaCount.find((u) => u.name === p.name)?.count.total || 0,
      },
      {
        category: 'Sana Compañía',
        value: p.count['Sana Compañía'] || 0,
        total:
          p.count.total + (usersPerComunaCount.find((u) => u.name === p.name)?.count.total || 0),
        prestadores: p.count.total,
        usuarios: usersPerComunaCount.find((u) => u.name === p.name)?.count.total || 0,
      },
      {
        category: 'Servicios de enfermería',
        value: p.count['Servicios de enfermería'] || 0,
        total:
          p.count.total + (usersPerComunaCount.find((u) => u.name === p.name)?.count.total || 0),
        prestadores: p.count.total,
        usuarios: usersPerComunaCount.find((u) => u.name === p.name)?.count.total || 0,
      },
    ],
  }));

  const totalSeries = series.length;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={series}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
          type="category"
          allowDuplicatedCategory={false}
          padding={{
            left: 20,
            right: 20,
          }}
        />
        <YAxis dataKey="total" />
        {/* <Tooltip content={<CustomTooltip />} series={series} /> */}
        <Legend />
        {series.map((s, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey="value"
            data={s.data}
            name={s.name}
            stroke={generateColor(index, totalSeries)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// const CustomTooltip = ({ active, payload, label, series }: TooltipProps) => {
//   if (active && payload && payload.length) {
//     console.log('payload', payload, 'series', series);
//     // const data = series.find((p) => {
//     //   console.log(p.name, label);

//     //   p.name === label;
//     // });
//     // console.log('found data', data);
//     const data = payload.find((p, i) => p.name === series[i].name);
//     console.log('found data', data);
//     return (
//       <div
//         className="custom-tooltip"
//         style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}
//       >
//         <Text className="label">{`${label}`}</Text>
//         {payload.map((p) => (
//           <>
//             <p>{p.name}</p>
//             <p>total: {p.payload.prestadores + p.payload.usuarios}</p>
//             <p>Prestadores: {p.payload.prestadores}</p>
//             <p>Usuarios: {p.payload.usuarios}</p>
//             <hr />
//           </>
//         ))}
//       </div>
//     );
//   }

//   return null;
// };

const generateColor = (index: number, total: number) => {
  const hue = (index * (360 / total)) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};
