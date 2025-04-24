import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const DailyDataVisualization = ({ transactions }) => {
  // 獲取最近30天的日期範圍
  const getDateRange = () => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 29) // 最近30天
    
    const dates = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return dates
  }
  
  const dateRange = getDateRange()
  
  // 按日期分組交易
  const groupTransactionsByDate = () => {
    const dailyData = {}
    
    // 初始化所有日期的數據
    dateRange.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]
      dailyData[dateStr] = {
        income: 0,
        expense: 0
      }
    })
    
    // 填充交易數據
    transactions.forEach(transaction => {
      const dateStr = transaction.date
      if (dailyData[dateStr]) {
        if (transaction.type === 'income') {
          dailyData[dateStr].income += transaction.amount
        } else {
          dailyData[dateStr].expense += transaction.amount
        }
      }
    })
    
    return dailyData
  }
  
  const dailyData = groupTransactionsByDate()
  
  // 準備圖表數據
  const chartData = {
    labels: dateRange.map(date => {
      const day = date.getDate()
      const month = date.getMonth() + 1
      return `${month}/${day}`
    }),
    datasets: [
      {
        label: 'Income',
        data: dateRange.map(date => {
          const dateStr = date.toISOString().split('T')[0]
          return dailyData[dateStr].income
        }),
        borderColor: 'rgb(34, 211, 238)', // cyan-400
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Expenses',
        data: dateRange.map(date => {
          const dateStr = date.toISOString().split('T')[0]
          return dailyData[dateStr].expense
        }),
        borderColor: 'rgb(248, 113, 113)', // red-400
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  }
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(226, 232, 240)' // slate-200
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        titleColor: 'rgb(226, 232, 240)',
        bodyColor: 'rgb(226, 232, 240)',
        borderColor: 'rgba(100, 116, 139, 0.5)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(100, 116, 139, 0.2)'
        },
        ticks: {
          color: 'rgb(148, 163, 184)' // slate-400
        }
      },
      y: {
        grid: {
          color: 'rgba(100, 116, 139, 0.2)'
        },
        ticks: {
          color: 'rgb(148, 163, 184)', // slate-400
          callback: value => `$${value}`
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }
  
  return (
    <div className="w-full h-80">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default DailyDataVisualization 