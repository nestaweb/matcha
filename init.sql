CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    gender VARCHAR(255),
    sexualOrientation VARCHAR(255),
    age INT,
    goal VARCHAR(255),
    height INT,
    tags VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    city VARCHAR(255),
    friends VARCHAR(255),
    locationAccess BOOLEAN DEFAULT FALSE,
    fame INT DEFAULT 50,
    report_count INT DEFAULT 0,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_friends (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS profile_liked (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    liked_user_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (liked_user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, liked_user_id)
);

CREATE TABLE IF NOT EXISTS profile_blocked (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    blocked_user_id INT NOT NULL,
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, blocked_user_id)
);

CREATE TABLE IF NOT EXISTS profile_reported (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    reported_user_id INT NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (reported_user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, reported_user_id)
);

CREATE TABLE IF NOT EXISTS profile_views (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    viewed_user_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (viewed_user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, viewed_user_id)
);


CREATE TABLE IF NOT EXISTS otps (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    otp VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_message (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    room_id INT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_room (
    id SERIAL PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matcha_grid (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    finished BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matcha_pairs (
    id SERIAL PRIMARY KEY,
    grid_id INT NOT NULL,
    cell1 INT NOT NULL,
    cell2 INT NOT NULL,
    associated_user_id INT NOT NULL,
    discovered BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (grid_id) REFERENCES matcha_grid (id) ON DELETE CASCADE,
    FOREIGN KEY (associated_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matcha_clicked_cells (
    id SERIAL PRIMARY KEY,
    grid_id INT NOT NULL,
    cell_index INT NOT NULL,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grid_id) REFERENCES matcha_grid (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    title TEXT,
    date TIMESTAMP,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location, locationAccess) VALUES ('Nesta', 'Loisy', 'nesta.loisy@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 18, 'date', 'code', true, '41.38955,2.17627', true);
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User1', 'LastName2', 'l.2@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 28, 'date', 'code', true, '41.53324,2.44666');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User2', 'LastName3', 'l.3@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 25, 'date', 'bouldering,code', true, '42.54563,3.02542');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User3', 'LastName4', 'l.4@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 18, 'date', 'computer', true, '43.60161,3.88205');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User4', 'LastName5', 'l.5@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 18, 'date', 'ai,computer', true, '41.43682,2.17012');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User5', 'LastName6', 'l.6@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 87, 'date', '42,code,computer,bouldering', true, '41.43682,2.17012');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User6', 'LastName7', 'l.7@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 21, 'date', '42,code', true, '41.43682,2.17012');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User7', 'LastName8', 'l.8@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 37, 'date', '42', true, '41.43682,2.17012');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User8', 'LastName9', 'l.9@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 19, 'date', '42', true, '41.43682,2.17012');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified, location) VALUES ('User9', 'LastName10', 'l.10@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 20, 'date', '42', true, '41.43682,2.17012');
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified) VALUES ('User10', 'LastName11', 'l.11@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 42, 'date', '42', true);
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified) VALUES ('User11', 'LastName12', 'l.12@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 57, 'date', '42', true);
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, tags, verified) VALUES ('User12', 'LastName13', 'l.13@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 19, 'date', '42', true);

INSERT INTO user_friends (user_id, friend_id) VALUES (2, 3);
-- INSERT INTO user_friends (user_id, friend_id) VALUES (3, 1);
-- INSERT INTO user_friends (user_id, friend_id) VALUES (1, 4);
-- INSERT INTO user_friends (user_id, friend_id) VALUES (1, 2);

INSERT INTO profile_blocked (user_id, blocked_user_id) VALUES (11, 1);
-- INSERT INTO profile_blocked (user_id, blocked_user_id) VALUES (12, 1);
-- INSERT INTO profile_blocked (user_id, blocked_user_id) VALUES (1, 13);
INSERT INTO profile_blocked (user_id, blocked_user_id) VALUES (10, 1);
INSERT INTO profile_blocked (user_id, blocked_user_id) VALUES (1, 9);
INSERT INTO profile_blocked (user_id, blocked_user_id) VALUES (1, 8);