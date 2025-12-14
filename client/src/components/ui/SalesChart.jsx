import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Calendar, TrendingUp, Package, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { fetchSalesData } from "../../store/slices/adminSlice";

const SalesChart = ({ timeRange = "7d" }) => {
  const dispatch = useDispatch();
  const { salesData, isLoading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchSalesData(timeRange));
  }, [dispatch, timeRange]);

  const formatCurrency = value => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

  const totalSales = salesData.reduce((sum, item) => sum + item.totalSales, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orderCount, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-kawaii shadow-kawaii border border-gray-200">
          <p className="text-sm font-medium text-dark-slate">
            {formatDate(label)}
          </p>
          <div className="space-y-1 mt-2">
            <p className="text-sm text-bubblegum">
              Sales:{" "}
              <span className="font-semibold">
                {formatCurrency(payload[0].value)}
              </span>
            </p>
            <p className="text-sm text-electric-teal">
              Orders:{" "}
              <span className="font-semibold">{payload[1]?.value || 0}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-kawaii p-6 shadow-kawaii">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-kawaii p-6 shadow-kawaii border border-white/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-bubblegum to-electric-teal rounded-kawaii flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-dark-slate">
              Sales Analytics
            </h3>
            <p className="text-sm text-dark-slate/70">
              Sales trends over the last{" "}
              {timeRange === "7d"
                ? "7 days"
                : timeRange === "30d"
                ? "30 days"
                : "12 months"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-dark-slate/70">
          <Calendar className="w-4 h-4" />
          <span>
            Last{" "}
            {timeRange === "7d"
              ? "Week"
              : timeRange === "30d"
              ? "Month"
              : "Year"}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-bubblegum/10 to-bubblegum/5 rounded-kawaii p-4 border border-bubblegum/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bubblegum/20 rounded-kawaii flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-bubblegum" />
            </div>
            <div>
              <p className="text-sm text-dark-slate/70">Total Sales</p>
              <p className="text-lg font-semibold text-dark-slate">
                {formatCurrency(totalSales)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-electric-teal/10 to-electric-teal/5 rounded-kawaii p-4 border border-electric-teal/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-electric-teal/20 rounded-kawaii flex items-center justify-center">
              <Package className="w-5 h-5 text-electric-teal" />
            </div>
            <div>
              <p className="text-sm text-dark-slate/70">Total Orders</p>
              <p className="text-lg font-semibold text-dark-slate">
                {totalOrders}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-lavender/10 to-lavender/5 rounded-kawaii p-4 border border-lavender/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lavender/20 rounded-kawaii flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-lavender" />
            </div>
            <div>
              <p className="text-sm text-dark-slate/70">Avg. Order Value</p>
              <p className="text-lg font-semibold text-dark-slate">
                {formatCurrency(avgOrderValue)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF69B4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF69B4" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#40E0D0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#40E0D0" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#888"
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#888"
              fontSize={12}
              tickFormatter={value => `₹${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="totalSales"
              stroke="#FF69B4"
              fill="url(#salesGradient)"
              strokeWidth={2}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orderCount"
              stroke="#40E0D0"
              strokeWidth={2}
              dot={{ fill: "#40E0D0", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: "#40E0D0",
                strokeWidth: 2,
                fill: "#fff",
              }}
              name="Orders"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-bubblegum rounded-full"></div>
          <span className="text-sm text-dark-slate/70">Sales Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-electric-teal rounded-full"></div>
          <span className="text-sm text-dark-slate/70">Order Count</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SalesChart;
