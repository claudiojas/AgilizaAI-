import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports';

type Period = 'week' | 'month';

export const useSalesOverTimeQuery = (period: Period) => {
  return useQuery({
    queryKey: ['reports', 'salesOverTime', period],
    queryFn: () => reportsService.getSalesOverTime(period),
  });
};

export const useProductPerformanceQuery = (period: Period) => {
  return useQuery({
    queryKey: ['reports', 'productPerformance', period],
    queryFn: () => reportsService.getProductPerformance(period),
  });
};

export const useSalesByPaymentMethodQuery = (period: Period) => {
  return useQuery({
    queryKey: ['reports', 'salesByPaymentMethod', period],
    queryFn: () => reportsService.getSalesByPaymentMethod(period),
  });
};

export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: ['reports', 'dashboardSummary'],
    queryFn: () => reportsService.getDashboardSummary(),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useSalesByTableQuery = (period: Period) => {
  return useQuery({
    queryKey: ['reports', 'salesByTable', period],
    queryFn: () => reportsService.getSalesByTable(period),
  });
};
