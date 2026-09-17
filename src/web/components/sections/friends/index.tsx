import { Image } from "@/web/components/ui/image";
import { Label } from "@/web/components/ui/label";
import { friends } from "@/web/data/friends";

import "./index.css";

export const Friends = () => {
	return (
		<div>
			<Label>Friends</Label>
			<div className="friends">
				{friends.map((friend) => (
					<a
						key={friend.name}
						className="friend"
						href={friend.href}
						target="_blank"
						rel="noreferrer"
						aria-label={`Visit ${friend.name}'s website`}
					>
						<Image
							className="avatar circle large"
							src={friend.avatar}
							alt={`${friend.name}'s avatar`}
							width={84}
							height={84}
						/>
					</a>
				))}
			</div>
		</div>
	);
};
