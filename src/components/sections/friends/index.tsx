import { friends } from "../../../data/friends";
import { Label } from "../../ui/label";
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
						<img
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
