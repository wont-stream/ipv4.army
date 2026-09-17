import { friends } from "@/data/friends";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";

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
						/>
					</a>
				))}
			</div>
		</div>
	);
};
