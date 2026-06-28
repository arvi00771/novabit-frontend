import { createChart, ColorType, type ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export const PriceChart = (props: {
  data: any[];
  backgroundColor?: string;
  textColor?: string;
}) => {
  const {
    data,
    backgroundColor = 'white',
    textColor = 'black',
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#f0f3fa' },
        horzLines: { color: '#f0f3fa' },
      },
      timeScale: {
        borderColor: '#f0f3fa',
      },
    });

    chart.timeScale().fitContent();

    // Use addCandlestickSeries and cast chart to any if needed to bypass TS error for now
    // Or check if v4 has a different name. It should be addCandlestickSeries.
    const series = (chart as any).addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    }) as ISeriesApi<"Candlestick">;

    series.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, textColor]);

  return <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />;
};
