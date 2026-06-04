import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function ButtonBlue({ to, children }: { to: string; children: string }) {
  const btnBaseClass =
    "px-7 py-3 text-xs md:text-sm transition-all duration-300 active:scale-95";

  return (
    <Link
      to={to}
      className={`group ${btnBaseClass} bg-blue-500 rounded-sm font-semibold text-white text-center hover:shadow-lg hover:shadow-black/20 inline-flex items-center gap-2 justify-center `}
    >
      {children}
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export default ButtonBlue;
