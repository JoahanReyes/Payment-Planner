import { Component, OnInit, computed, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { NgClass, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home.component',
  imports: [NgClass, DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  name: string = 'Joahan';

  FinancialSummary = signal([
    { type: 'Income', amount: 5000 },
    { type: 'Expenses', amount: 3000 },
    { type: 'Savings', amount: 2000 },
  ]);

  FinancialBalance = computed(() => {
    const summary = this.FinancialSummary();
    const totalIncome =
      summary.find((item) => item.type === 'Income')?.amount || 0;
    const totalExpenses =
      summary.find((item) => item.type === 'Expenses')?.amount || 0;
    const totalSavings =
      summary.find((item) => item.type === 'Savings')?.amount || 0;
    const FinalBalance = totalIncome - totalExpenses - totalSavings;

    const incomeColor = computed(() => {
      const val = summary.find((item) => item.type === 'Income')?.amount || 0;
      if (val >= 0) return 'text-[var(--color-success)]';
      else if (val <= 0) return 'text-[var(--color-error)]';
      else return 'text-[var(--color-warning)]';
    });

    const expensesColor = computed(() => {
      const val = summary.find((item) => item.type === 'Expenses')?.amount || 0;
      if (val >= 0) return 'text-[var(--color-error)]';
      else if (val <= 0) return 'text-[var(--color-success)]';
      else return 'text-[var(--color-warning)]';
    });

    const savingsColor = computed(() => {
      const val = summary.find((item) => item.type === 'Savings')?.amount || 0;
      if (val >= 0) return 'text-[var(--color-success)]';
      else if (val <= 0) return 'text-[var(--color-error)]';
      else return 'text-[var(--color-warning)]';
    });

    const balanceColor = computed(() => {
      const val = FinalBalance;
      if (val > 0) return 'text-[var(--color-success)]';
      else if (val < 0) return 'text-[var(--color-error)]';
      else return 'text-[var(--color-warning)]';
    });

    return {
      FinalBalance,
      balanceColor,
      incomeColor,
      expensesColor,
      savingsColor,
    };
  });

  plannedExpenses = signal([
    { name: 'Renta', amount: 1000, date: '2025-11-15' },
    { name: 'Transporte', amount: 500, date: '2025-11-15' },
    { name: 'Recreación', amount: 300, date: '2025-11-15' },
    { name: 'Deudas', amount: 700, date: '2025-11-15' },
  ]);

  plannedDebts = signal([
    { name: 'Préstamo Estudiantil', total: 10000, remaining: 5000 },
    { name: 'Tarjeta de Crédito', total: 4000, remaining: 500 },
    { name: 'Préstamo de Auto', total: 16000, remaining: 14000 },
    { name: 'Préstamo Personal', total: 112000, remaining: 100000 },
  ]);

  Debtprogress = computed(() => {
    const debts = this.plannedDebts();
    if (!debts.length) {
      return {
        average: 0,
        totalRemaining: 0,
        totalPaid: 0,
        totalAmount: 0,
        details: [],
      };
    }

    const details = debts.map((debt) => {
      const paid = debt.total - debt.remaining;
      const progress = (paid / debt.total) * 100;
      return { ...debt, paid, progress };
    });

    const totalAmount = debts.reduce((sum, d) => sum + d.total, 0);
    const totalPaid = debts.reduce(
      (sum, d) => sum + (d.total - d.remaining),
      0
    );
    const totalRemaining = totalAmount - totalPaid;
    const average = (totalPaid / totalAmount) * 100;

    return { average, totalPaid, totalRemaining, totalAmount, details };
  });

  constructor() {}
  ngOnInit(): void {}
}
