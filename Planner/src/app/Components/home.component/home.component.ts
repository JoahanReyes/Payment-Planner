import { Component, computed, signal, AfterViewInit } from '@angular/core';
import { NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { Chart, ArcElement, ChartTypeRegistry, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-home.component',
  imports: [NgClass, DecimalPipe, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  name: string = 'Joahan';

  FinancialSummary = signal([
    { type: 'Ingresos', amount: 5000 },
    { type: 'Gastos', amount: 3000 },
    { type: 'Ahorros', amount: 2000 },
  ]);

  FinancialBalance = computed(() => {
    const summary = this.FinancialSummary();
    const totalIncome =
      summary.find((item) => item.type === 'Ingresos')?.amount || 0;
    const totalExpenses =
      summary.find((item) => item.type === 'Gastos')?.amount || 0;
    const totalSavings =
      summary.find((item) => item.type === 'Ahorros')?.amount || 0;
    const FinalBalance = totalIncome - totalExpenses - totalSavings;

    const incomeColor = computed(() => {
      const val = summary.find((item) => item.type === 'Ingresos')?.amount || 0;
      if (val >= 0) return 'text-[var(--color-success)]';
      else if (val <= 0) return 'text-[var(--color-error)]';
      else return 'text-[var(--color-warning)]';
    });

    const expensesColor = computed(() => {
      const val = summary.find((item) => item.type === 'Gastos')?.amount || 0;
      if (val >= 0) return 'text-[var(--color-error)]';
      else if (val <= 0) return 'text-[var(--color-success)]';
      else return 'text-[var(--color-warning)]';
    });

    const savingsColor = computed(() => {
      const val = summary.find((item) => item.type === 'Ahorros')?.amount || 0;
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
    {
      name: 'Renta',
      amount: 1000,
      dueDate: '2025-11-15',
      status: 'Pagado',
      category: 'housing',
    },
    {
      name: 'Transporte',
      amount: 500,
      dueDate: '2025-11-15',
      status: 'Pendiente',
      category: 'transport',
    },
    {
      name: 'Recreación',
      amount: 300,
      dueDate: '2025-11-15',
      status: 'Pendiente',
      category: 'entertainment',
    },
    {
      name: 'Deudas',
      amount: 700,
      dueDate: '2025-11-03',
      status: 'Vencido',
      category: 'debt',
    },
  ]);

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pagado':
        return 'text-[var(--color-success)]';
      case 'Pendiente':
        return 'text-[var(--color-warning)]';
      case 'Vencido':
        return 'text-[var(--color-error)]';
      default:
        return '';
    }
  }

  togglePaymentStatus(expense: any) {
    const today = new Date().toISOString().split('T')[0];

    const updatedExpenses = this.plannedExpenses().map((e) => {
      if (e.name === expense.name) {
        let newStatus = e.status;

        switch (e.status) {
          case 'Pagado':
            // Si lo regresamos y la fecha ya pasó, se vuelve vencido
            newStatus = e.dueDate < today ? 'Vencido' : 'Pendiente';
            break;

          case 'Pendiente':
            // Si la fecha ya pasó, pasa a vencido, si no, a pagado
            newStatus = e.dueDate < today ? 'Vencido' : 'Pagado';
            break;

          case 'Vencido':
            // Si lo marcamos manualmente, se considera pagado
            newStatus = 'Pagado';
            break;
        }

        return { ...e, status: newStatus };
      }
      return e;
    });

    this.plannedExpenses.set(updatedExpenses);
  }

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
  ngAfterViewInit(): void {
    const ctx = document.getElementById(
      'expensesPieChart'
    ) as HTMLCanvasElement;

    // Colores del tema
    const styles = getComputedStyle(document.documentElement);
    const colorRent = styles.getPropertyValue('--color-primary').trim();
    const colorFood = styles.getPropertyValue('--cat-food').trim();
    const colorServices = styles.getPropertyValue('--cat-other').trim();
    const colorEntertainment = styles
      .getPropertyValue('--cat-entertainment')
      .trim();

    // SVGs en assets (asegúrate de que las rutas existen)
    const iconPaths = [
      'assets/svgs-full/solid/house.svg',
      'assets/svgs-full/solid/bus.svg',
      'assets/svgs-full/solid/gamepad.svg',
      'assets/svgs-full/solid/credit-card.svg',
    ];

    // Cargar las imágenes y esperar a que todas estén listas
    const loadIcons = (paths: string[]): Promise<HTMLImageElement[]> =>
      Promise.all(
        paths.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = (err) => reject(err);
              img.src = src;
            })
        )
      );

    // Crear el gráfico una vez que las imágenes estén cargadas
    loadIcons(iconPaths).then((icons) => {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Renta', 'Transporte', 'Recreación', 'Deudas'],
          datasets: [
            {
              data: [2500, 1200, 800, 400],
              backgroundColor: [
                colorRent,
                colorFood,
                colorServices,
                colorEntertainment,
              ],
              borderColor: 'transparent',
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: 'bottom' },
          },
        },
        plugins: [
          {
            id: 'centerIcons',
            afterDraw(chart) {
              const meta = chart.getDatasetMeta(0);
              const arcs = meta.data as unknown as ArcElement[];
              const ctx = chart.ctx;

              if (!arcs || arcs.length === 0) return;

              // 🔹 Calcular radio medio
              const radius =
                ((arcs[0] as any).outerRadius + (arcs[0] as any).innerRadius) /
                2;

              arcs.forEach((arc: any, i: number) => {
                const start = arc.startAngle;
                const end = arc.endAngle;
                const angle = (start + end) / 2;

                const x = arc.x + Math.cos(angle) * radius;
                const y = arc.y + Math.sin(angle) * radius;

                const img = icons[i];
                const size = 28;

                ctx.save();
                ctx.globalAlpha = 0.9;
                ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
                ctx.restore();
              });
            },
          },
        ],
      });
    });
  }
}
