import { useState, useEffect } from "react"
import { useTranslation } from "../../contexts/LanguageContext"
import { Calendar, Download, Filter } from "lucide-react"

const EnrollmentReport = () => {
  const { t } = useTranslation()
  const [selectedYear, setSelectedYear] = useState("2024-25")
  const [selectedSession, setSelectedSession] = useState("2024-25")

  // Mock enrollment data based on the image
  const enrollmentData = [
    {
      class: "Nursery",
      boys: { general: 15, sc: 8, st: 5, obc: 12, sbc: 2, total: 42 },
      girls: { general: 12, sc: 6, st: 4, obc: 10, sbc: 1, total: 33 },
      total: { general: 27, sc: 14, st: 9, obc: 22, sbc: 3, total: 75 }
    },
    {
      class: "LKG",
      boys: { general: 18, sc: 10, st: 6, obc: 14, sbc: 3, total: 51 },
      girls: { general: 15, sc: 8, st: 5, obc: 12, sbc: 2, total: 42 },
      total: { general: 33, sc: 18, st: 11, obc: 26, sbc: 5, total: 93 }
    },
    {
      class: "UKG",
      boys: { general: 20, sc: 11, st: 7, obc: 15, sbc: 3, total: 56 },
      girls: { general: 16, sc: 9, st: 6, obc: 13, sbc: 2, total: 46 },
      total: { general: 36, sc: 20, st: 13, obc: 28, sbc: 5, total: 102 }
    },
    {
      class: "1st",
      boys: { general: 22, sc: 12, st: 8, obc: 16, sbc: 4, total: 62 },
      girls: { general: 18, sc: 10, st: 7, obc: 14, sbc: 3, total: 52 },
      total: { general: 40, sc: 22, st: 15, obc: 30, sbc: 7, total: 114 }
    },
    {
      class: "2nd",
      boys: { general: 24, sc: 13, st: 9, obc: 17, sbc: 4, total: 67 },
      girls: { general: 20, sc: 11, st: 8, obc: 15, sbc: 3, total: 57 },
      total: { general: 44, sc: 24, st: 17, obc: 32, sbc: 7, total: 124 }
    },
    {
      class: "3rd",
      boys: { general: 25, sc: 14, st: 10, obc: 18, sbc: 5, total: 72 },
      girls: { general: 21, sc: 12, st: 9, obc: 16, sbc: 4, total: 62 },
      total: { general: 46, sc: 26, st: 19, obc: 34, sbc: 9, total: 134 }
    },
    {
      class: "4th",
      boys: { general: 26, sc: 15, st: 11, obc: 19, sbc: 5, total: 76 },
      girls: { general: 22, sc: 13, st: 10, obc: 17, sbc: 4, total: 66 },
      total: { general: 48, sc: 28, st: 21, obc: 36, sbc: 9, total: 142 }
    },
    {
      class: "5th",
      boys: { general: 28, sc: 16, st: 12, obc: 20, sbc: 6, total: 82 },
      girls: { general: 24, sc: 14, st: 11, obc: 18, sbc: 5, total: 72 },
      total: { general: 52, sc: 30, st: 23, obc: 38, sbc: 11, total: 154 }
    }
  ]

  // Calculate grand totals
  const grandTotals = enrollmentData.reduce(
    (acc, curr) => {
      acc.boys.total += curr.boys.total
      acc.girls.total += curr.girls.total
      acc.total.total += curr.total.total
      
      Object.keys(curr.total).forEach(key => {
        if (key !== 'total') {
          acc.total[key] = (acc.total[key] || 0) + curr.total[key]
        }
      })
      
      return acc
    },
    { boys: { total: 0 }, girls: { total: 0 }, total: { total: 0 } }
  )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('reports.enrollmentReport')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('reports.enrollmentSubtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            {t('common.filter')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg">
            <Download className="w-4 h-4" />
            {t('common.download')}
          </button>
        </div>
      </div>

      {/* Year and Session Selection */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reports.academicYear')}
            </label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reports.session')}
            </label>
            <select 
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-scroll">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th rowSpan="3" className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                {t('reports.class')}
              </th>
              <th colSpan="6" className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                {t('reports.boys')}
              </th>
              <th colSpan="6" className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                {t('reports.girls')}
              </th>
              <th colSpan="6" className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                {t('reports.total')}
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">GEN</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">SC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">ST</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">OBC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">SBC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">{t('reports.total')}</th>
              
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">GEN</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">SC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">ST</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">OBC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">SBC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">{t('reports.total')}</th>
              
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">GEN</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">SC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">ST</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">OBC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">SBC</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">{t('reports.total')}</th>
            </tr>
          </thead>
          <tbody>
            {enrollmentData.map((row, index) => (
              <tr key={row.class} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">
                  {row.class}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.boys.general}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.boys.sc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.boys.st}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.boys.obc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.boys.sbc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-900">{row.boys.total}</td>
                
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.girls.general}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.girls.sc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.girls.st}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.girls.obc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.girls.sbc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-900">{row.girls.total}</td>
                
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.total.general}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.total.sc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.total.st}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.total.obc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-gray-700">{row.total.sbc}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-bold text-indigo-600">{row.total.total}</td>
              </tr>
            ))}
            {/* Grand Total Row */}
            <tr className="bg-indigo-50 font-bold">
              <td className="border border-gray-300 px-4 py-3 text-center text-gray-900">
                {t('reports.grandTotal')}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{grandTotals.boys.total}</td>
              
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">-</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{grandTotals.girls.total}</td>
              
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{grandTotals.total.general || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{grandTotals.total.sc || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{grandTotals.total.st || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{grandTotals.total.obc || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">{grandTotals.total.sbc || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-indigo-600 text-lg">{grandTotals.total.total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{selectedYear}</p>
              <p className="text-xs text-gray-500">{t('reports.academicYear')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{grandTotals.boys.total}</p>
              <p className="text-xs text-gray-500">{t('reports.totalBoys')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{grandTotals.girls.total}</p>
              <p className="text-xs text-gray-500">{t('reports.totalGirls')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{grandTotals.total.total}</p>
              <p className="text-xs text-gray-500">{t('reports.totalStudents')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentReport
