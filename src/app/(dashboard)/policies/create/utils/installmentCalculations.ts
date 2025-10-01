interface InstallmentRow {
  numero: number
  desde: string
  hasta: string
  monto: number
}

interface CalculateInstallmentsParams {
  startDate: string // Fecha de vigencia inicial
  periodMonths: number // Período en meses
  installmentsCount: number // Número de cuotas
  annualPremium: number // Prima anual
}

export function calculateInstallments({
  startDate,
  periodMonths,
  installmentsCount,
  annualPremium
}: CalculateInstallmentsParams): InstallmentRow[] {
  const installments: InstallmentRow[] = []
  const premiumPerInstallment = Math.round((annualPremium / installmentsCount) * 100) / 100

  // Calcular meses por cuota: período total / número de cuotas
  const monthsPerInstallment = periodMonths / installmentsCount

  const baseDate = new Date(startDate)

  for (let i = 0; i < installmentsCount; i++) {
    const fromDate = new Date(baseDate)

    fromDate.setMonth(baseDate.getMonth() + i * monthsPerInstallment)

    const toDate = new Date(fromDate)

    toDate.setMonth(fromDate.getMonth() + monthsPerInstallment)

    toDate.setDate(toDate.getDate() - 1)

    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()

      return `${year}-${month}-${day}`
    }

    installments.push({
      numero: i + 1,
      desde: formatDate(fromDate),
      hasta: formatDate(toDate),
      monto: premiumPerInstallment
    })
  }

  return installments
}

export function getPeriodName(months: number): string {
  const periodNames: { [key: number]: string } = {
    1: 'Mensual',
    2: 'Bimensual',
    3: 'Trimestral',
    4: 'Cuatrimestral',
    6: 'Semestral',
    12: 'Anual'
  }

  return periodNames[months] || `${months} meses`
}
