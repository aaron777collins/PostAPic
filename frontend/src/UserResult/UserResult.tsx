import { Button, Link, ListItem } from "@mui/material";
import * as React from "react";
import "./UserResult.css";

export interface IUserResultProps {
  user: {
    userid: string;
    username: string;
  };
  urlExtension: string;
}

export default function UserResult(props: IUserResultProps) {
  const { user } = props;
  const [isFollowing, setIsFollowing] = React.useState(false);

  return (
    <ListItem className="user-result-container">
      <Link
        sx={{ textDecoration: "none", color: "black", cursor: "pointer" }}
        href={props.urlExtension + "/profile/" + user.username}
      >
        <h2 className="username-header">{user.username}</h2>
      </Link>
      {/* follow/unfollow button on right side */}
      <div className="button-container">
        {isFollowing ? (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            className="follow-unfollow-button"
            sx={{ ml: 1 }}
            onClick={() => setIsFollowing(false)}
          >
            Unfollow
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            className="follow-unfollow-button"
            sx={{ ml: 1 }}
            onClick={() => setIsFollowing(true)}
          >
            Follow
          </Button>
        )}
      </div>
    </ListItem>
  );
}
