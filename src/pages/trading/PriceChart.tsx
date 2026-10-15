import { createChart, ColorType, CandlestickSeries, HistogramSeries, type ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const PriceChart = (props: {
  data: KlineData[];
  volumeData?: { time: string; value: number; color: string }[];
  backgroundColor?: string;
  textColor?: string;
}) => {
  const { data, volumeData, backgroundColor = 'white', textColor = 'black' } = props;
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
      height: 450,
      grid: {
        vertLines: { color: '#f0f3fa' },
        horzLines: { color: '#f0f3fa' },
      },
      timeScale: {
        borderColor: '#f0f3fa',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#f0f3fa',
      },
      crosshair: {
        mode: 0,
      },
    });

    // Candlestick series.
    // lightweight-charts v5 removed chart.addCandlestickSeries(); series are
    // created through chart.addSeries(<SeriesDefinition>, options).
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    }) as ISeriesApi<'Candlestick'>;

    candleSeries.setData(data as any);

    // Volume histogram
    if (volumeData && volumeData.length > 0) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.85, bottom: 0 },
      });

      volumeSeries.setData(volumeData as any);
    }

    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, volumeData, backgroundColor, textColor]);

  return <div ref={chartContainerRef} className="w-full h-full min-h-[450px]" />;
};