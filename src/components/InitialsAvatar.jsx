
const InitialsAvatar = ({ name, size = "50px", fontSize = "text-lg", className = "" }) => {
    const getInitials = (n) => {
        if (!n) return "??";
        const parts = n.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return (parts[0][0] + (parts[0][1] || "")).toUpperCase();
    };

    const getColor = (n) => {
        const colors = [
            'bg-blue-100 text-blue-600 border-blue-200',
            'bg-purple-100 text-purple-600 border-purple-200',
            'bg-orange-100 text-orange-600 border-orange-200',
            'bg-green-100 text-green-600 border-green-200',
            'bg-pink-100 text-pink-600 border-pink-200',
            'bg-cyan-100 text-cyan-600 border-cyan-200',
        ];
        if (!n) return colors[0];
        let hash = 0;
        for (let i = 0; i < n.length; i++) {
            hash = n.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const colorClasses = className.includes('bg-') ? className : `${getColor(name)} ${className}`;

    return (
        <div 
            style={{ width: size, height: size, minWidth: size, minHeight: size }}
            className={`rounded-full flex items-center justify-center font-bold border ${fontSize} ${colorClasses}`}
        >
            {getInitials(name)}
        </div>
    );
};

export default InitialsAvatar;
