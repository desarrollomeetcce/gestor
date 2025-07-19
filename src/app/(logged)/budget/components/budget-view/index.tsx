"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import MultiselectSearch from "@/shared/multiselect-search";
import { formatCurrency } from "@/utils/actions";
import { getAssignedWorkLogsByRange } from "../../application/get";


interface Props {
    users: { id: number; name: string }[];
}

interface WorkLog {
    id: number;
    userId: number;
    date: string;
    hours: number;
    costPerHour: number | null;
}

interface SummaryByUser {
    userId: number;
    name: string;
    total: number;
    hours: number;
    byMonth: {
        [month: string]: {
            hours: number;
            total: number;
        };
    };
}

export default function BudgetView({ users }: Props) {
    const [fromDate, setFromDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [toDate, setToDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [selectedIds, setSelectedIds] = useState<number[]>([users[0]?.id]);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const form = new FormData();
            form.append('startDate', fromDate);
            form.append('endDate', toDate);
            selectedIds.forEach(id => form.append('userIds', id.toString()));

            const res = await getAssignedWorkLogsByRange(null, form);
            if (res.status === "success" && res.data) {
                setLogs(res.data);
            }
        }
        if (selectedIds.length > 0) {
            load();
        }
    }, [selectedIds, fromDate, toDate]);


    const summary: SummaryByUser[] = users
        .filter((u) => selectedIds.includes(u.id))
        .map((user) => {
            const userLogs = logs.filter((log) => log.userId === user.id && (log.costPerHour ?? 0) > 0);
            const total = userLogs.reduce((acc, log) => acc + log.hours * (log.costPerHour ?? 0), 0);
            const hours = userLogs.reduce((acc, log) => acc + log.hours, 0);

            const byMonth: SummaryByUser["byMonth"] = {};
            userLogs.forEach((log) => {
                const date = new Date(log.date);
                const key = format(date, "yyyy-MM");
                if (!byMonth[key]) byMonth[key] = { hours: 0, total: 0 };
                byMonth[key].hours += log.hours;
                byMonth[key].total += log.hours * (log.costPerHour ?? 0);
            });

            return { userId: user.id, name: user.name, total, hours, byMonth };
        });

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-white">Resumen de costos por rango</h2>

            <div className="flex flex-wrap gap-4 items-end">
                <div className="max-w-md w-full">
                    <MultiselectSearch
                        options={users.map((u) => ({ id: u.id, label: u.name }))}
                        selected={selectedIds}
                        onChange={setSelectedIds}
                        placeholder="Selecciona usuarios"
                    />
                </div>

                <div>
                    <label className="block text-white text-sm">Desde</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="bg-slate-800 text-white rounded px-2 py-1"
                    />
                </div>

                <div>
                    <label className="block text-white text-sm">Hasta</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="bg-slate-800 text-white rounded px-2 py-1"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {summary.map((s) => (
                    <div key={s.userId} className="bg-slate-900 p-4 rounded shadow text-white">
                        <p className="text-lg font-bold text-blue-300">{s.name}</p>
                        <p>
                            Total Horas: <strong>{s.hours}</strong>
                        </p>
                        <p>
                            Total Costo: <strong className="text-green-400">{formatCurrency(s.total)}</strong>
                        </p>
                        <div className="mt-2 text-sm">
                            {Object.entries(s.byMonth).map(([month, val]) => (
                                <p key={month}>
                                    📆 {month}: {val.hours} hrs — <strong>{formatCurrency(val.total)}</strong>
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
