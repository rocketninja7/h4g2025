import React from 'react';

export default function ReceiveTask({name, start, end, invitedUsers, confirmedUsers, handleAcceptTask, handleRejectTask}) {
    return (
        <div>
          <h1>{name}</h1>
          <label>From {start} to {end}</label>
          <label>Invited: {invitedUsers.map(user => user.name).join(", ")}</label>
          <label>Going:  {confirmedUsers.map(user => user.name).join(", ")}</label>
          <button className="button" onClick={handleAcceptTask}>I'm going</button>
          <button className="button" onClick={handleRejectTask}>I'm busy</button>
        </div>
      );
}
