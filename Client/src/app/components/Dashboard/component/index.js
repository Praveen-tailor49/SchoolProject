export function Card({ className = "", children }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={`mb-4 flex flex-col gap-1 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }) {
  return <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>;
}

export function CardContent({ className = "", children }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}

 export function Badge({ children, variant = "default", className = "" }) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const variants = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-200 text-gray-700",
    success: "bg-green-600 text-white",
    destructive: "bg-red-600 text-white",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

 export function Table({ children, className = "" }) {
    return (
        <table className={`w-full text-sm text-left border-collapse ${className}`}>
            {children}
        </table>
    );
}

 export function TableHeader({ children }) {
    return <thead className="bg-gray-100">{children}</thead>;
}

 export function TableRow({ children }) {
    return (
        <tr className="border-b last:border-none">
            {children}
        </tr>
    );
}

 export function TableHead({ children, className = "" }) {
    return (
        <th className={`px-4 py-2 font-semibold ${className}`}>
            {children}
        </th>
    );
}

 export function TableBody({ children }) {
    return <tbody>{children}</tbody>;
}

 export function TableCell({ children, className = "" }) {
    return (
        <td className={`px-4 py-2 text-gray-800 ${className}`}>
            {children}
        </td>
    );
}