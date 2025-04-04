


import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ArcElement } from 'chart.js';
import useTranslation from '../utils/useTranslation';
import FloatingWindow from './FloatingWindow'; // Import FloatingWindow component

Chart.register(ChartDataLabels, ArcElement);

type Expense = {
    categoryId?: number;
    categoryName?: string;
    amount: number;
    description?: string;
};

type Props = {
    expenses: Expense[];
    categories: { id: number; name: string }[];
};

// Function to calculate contrasting text color
const getTextColor = (backgroundColor: string): string => {
    const rgb = backgroundColor
        .replace(/^#/, '')
        .match(/.{2}/g)!
        .map((x) => parseInt(x, 16));
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 125 ? '#333' : '#fff'; // Dark text for light backgrounds, white for dark
};

export default function ExpensesPieChart({ expenses, categories }: Props) {
    const t = useTranslation();
    const [groupedExpenses, setGroupedExpenses] = useState<Record<string, number>>({});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);
    const [isWindowOpen, setIsWindowOpen] = useState(false);

    useEffect(() => {
        const grouped = expenses.reduce((acc: Record<string, number>, expense) => {
            const category =
                expense.categoryName ||
                categories.find((cat) => cat.id === expense.categoryId)?.name ||
                `${t.unknownCategory} ${expense.categoryId || 'N/A'}`;
            acc[category] = (acc[category] || 0) + Number(expense.amount);
            return acc;
        }, {});

        setGroupedExpenses(grouped);
    }, [expenses, categories, t]);

    const totalAmount = Object.values(groupedExpenses).reduce((acc, value) => acc + value, 0);

    const colors = [
        '#5adb8f', // Primary
        '#ff875b', // Secondary
        '#e4f9ec', // Light Primary
        '#ffcbb8', // Light Secondary
        '#92e5b0', // Tertiary Green
        '#ffa98a', // Tertiary Orange
        '#0ad275', // Dark Primary
        '#f24d06', // Dark Secondary
    ];

    const data = {
        labels: Object.keys(groupedExpenses),
        datasets: [
            {
                data: Object.values(groupedExpenses),
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2,
                hoverBackgroundColor: colors.map((color) => `${color}CC`), // Lighter on hover
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: t.isRTL ? 'top' : 'bottom',
                labels: {
                    font: {
                        size: 14,
                        family: 'Arial, sans-serif',
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const value = context.raw;
                        const percentage = ((value / totalAmount) * 100).toFixed(2);
                        return `${t.currencySymbol} ${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
            datalabels: {
                display: true,
                color: (context: any) =>
                    getTextColor(context.dataset.backgroundColor[context.dataIndex]), // Dynamic text color
                font: (context: any) => {
                    const totalValue = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const currentValue = context.dataset.data[context.dataIndex];
                    const percentage = (currentValue / totalValue) * 100;
                    return {
                        size: percentage < 5 ? 8 : percentage < 10 ? 10 : 12, // Smaller text for smaller segments
                        family: 'Arial, sans-serif',
                    };
                },
                formatter: (value: number, context: any) => {
                    const totalValue = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((value / totalValue) * 100).toFixed(1);
                    const category = context.chart.data.labels[context.dataIndex];

                    // Only display percentage if the segment is too small

                    if (Number(percentage) < 1) {
                        return ``;
                    }
                    if (Number(percentage) < 5) {
                        return `${percentage}%`;
                    }

                    return `${category}\n${percentage}%`;
                },
                anchor: 'center',
                align: 'center',
                clip: true,
                clamp: true,
                textAlign: t.isRTL ? 'right' : 'center',
            },
        },
        onClick: (_, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const category = data.labels[index];
                const expensesForCategory = expenses.filter(
                    (expense) =>
                        expense.categoryName === category ||
                        categories.find((cat) => cat.id === expense.categoryId)?.name === category
                );

                setSelectedCategory(category as string);
                setSelectedExpenses(expensesForCategory);
                setIsWindowOpen(true);
            }
        },
    };

    const a = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: t.isRTL ? 'top' : 'bottom',
                labels: {
                    font: {
                        size: 14,
                        family: 'Arial, sans-serif',
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const value = context.raw;
                        const percentage = ((value / totalAmount) * 100).toFixed(2);
                        return `${t.currencySymbol} ${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
            datalabels: {
                display: true,
                color: (context: any) => {
                    const backgroundColor = context.dataset.backgroundColor[context.dataIndex];
                    return getTextColor(backgroundColor); // Text color based on background
                },
                font: (context: any) => {
                    const totalValue = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const currentValue = context.dataset.data[context.dataIndex];
                    const percentage = (currentValue / totalValue) * 100;
                    return {
                        size: percentage > 5 ? 12 : 10, // Smaller text for smaller segments
                        family: 'Arial, sans-serif',
                    };
                },
                formatter: (value: number, context: any) => {
                    const totalValue = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((value / totalValue) * 100).toFixed(1);
                    const category = context.chart.data.labels[context.dataIndex];

                    // Only display percentage if the segment is too small
                    if (Number(percentage) < 5) {
                        return `${percentage}%`;
                    }

                    return `${category}\n${percentage}%`;
                },
                anchor: 'center',
                align: 'center',
                clip: true, // Ensure text stays within the chart
                clamp: true, // Prevent text from going outside the chart
                padding: {
                    top: 5,
                    bottom: 5,
                },
            },
        },
        layout: {
            padding: 20,
        },
        onClick: (_, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const category = data.labels[index];
                const expensesForCategory = expenses.filter(
                    (expense) =>
                        expense.categoryName === category ||
                        categories.find((cat) => cat.id === expense.categoryId)?.name === category
                );

                setSelectedCategory(category as string);
                setSelectedExpenses(expensesForCategory);
                setIsWindowOpen(true);
            }
        },
    };
    return (
        <div className="flex flex-col flex-1 bg-white/70 rounded-lg shadow-lg overflow-hidden hover:outline hover:shadow-xl hover:outline-primary duration-150">
            <h3 className="text-lg font-bold text-text_secondary mt-4 text-center">
                {t.expensesByCategory}
            </h3>
            <div className="grow shrink h-96 lg:h-fit sm:h-80 md:h-96">
                {expenses.length ? (
                    <Pie data={data} options={options} />
                ) : (
                    <div className="h-full flex justify-center items-center">{t.noExpenses}</div>
                )}
            </div>

            {/* Floating Window for detailed expenses */}
            <FloatingWindow
                isOpen={isWindowOpen}
                onClose={() => setIsWindowOpen(false)}
                title={`${t.expenses} - ${selectedCategory}`}
            >
                <ul className="space-y-4">
                    {selectedExpenses.length > 0 ? (
                        selectedExpenses.map((expense, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between p-4 border rounded-lg shadow hover:bg-gray-50 transition duration-150"
                            >
                                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                                    <span className="text-text font-medium">
                                        {expense.description || t.noDescription}
                                    </span>
                                </span>
                                <span className="text-text font-bold">
                                    {t.currencySymbol} {expense.amount.toLocaleString()}
                                </span>
                            </li>
                        ))
                    ) : (
                        <div className="text-center text-text_secondary">{t.noExpenses}</div>
                    )}
                </ul>
            </FloatingWindow>
        </div>
    );
}