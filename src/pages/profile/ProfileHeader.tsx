import { AuthUser } from "../appTypes";

interface Props {
  user: AuthUser;
  masterRating: number | null;
  masterReviewsCount: number;
}

export function ProfileHeader({ user, masterRating, masterReviewsCount }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 border border-neon-cyan/20" style={{ background: "linear-gradient(135deg, hsla(185,100%,10%,0.4) 0%, hsla(270,80%,15%,0.3) 100%)" }}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/30 to-accent/30 flex items-center justify-center text-2xl font-black text-white border border-neon-cyan/30 glow-cyan">
          {user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.phone}</p>
          {user.role === "master" && (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">Мастер</span>
              {masterRating !== null && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm font-bold text-white font-mono-tech">{masterRating}</span>
                  <span className="text-xs text-muted-foreground">· {masterReviewsCount} {masterReviewsCount === 1 ? "отзыв" : masterReviewsCount < 5 ? "отзыва" : "отзывов"}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
