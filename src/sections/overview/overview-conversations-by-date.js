import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';
import { useApi } from '../../hooks/use-api';
import { format } from 'date-fns';

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        columnWidth: '20px'
      }
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: [], // Update with correct values
      labels: {
        formatter: ts => format((ts*1000), 'MM/dd'),
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  };
};

export const OverviewConversationsByDate = (props) => {
  const {getDayStartBuckets} = useApi();
  const { chartSeries, sx, title } = props;
  const chartOptions = useChartOptions();
  chartOptions.xaxis.categories = getDayStartBuckets()

  // console.log(chartSeries)
  return (
    <Card sx={sx}>
      <CardHeader
        title={title}
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
    </Card>
  );
};

OverviewConversationsByDate.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object,
  title: PropTypes.string
};
