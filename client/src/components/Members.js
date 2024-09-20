import React, { useEffect, useState } from "react";

function Members() {
    const [members, setMembers] = useState([])

    useEffect(() => {
        fetch('members')
            .then((r) => r.json())
            .then(setMembers)
    }, [])

    return (
            <div className="members-container">
                <h1>Members</h1>
                <br></br>
                <ul className="members-list">
                    {members.map((member) => (
                        <li key={member.id} className="member-item">
                            <img src={member.avatar} alt={`${member.name}'s Avatar`} className="member-avatar"/>
                            <div className="member-info">
                            <span className="member-name">{member.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <br></br>
                <div>
                    <span>Not a member?</span>
                    <br></br>
                    <a href='/create-account' className="sign-up-link">Sign Up!</a>
                </div>
            </div>
    )
}

export default Members