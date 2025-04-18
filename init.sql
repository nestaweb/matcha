CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    provider VARCHAR(255),
    gender VARCHAR(255),
    sexualOrientation VARCHAR(255),
    age INT,
    goal VARCHAR(255),
    height INT,
    tags VARCHAR(255),
    bio TEXT,
    nb_photos INT DEFAULT 0,
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
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Barcelona area coordinates (main city and surrounding areas)
-- Barcelona center: 41.3851, 2.1734
-- L'Hospitalet: 41.3597, 2.0997
-- Badalona: 41.4500, 2.2472
-- Sant Cugat: 41.4736, 2.0844
-- Castelldefels: 41.2800, 1.9767
-- Mataró: 41.5400, 2.4450
-- Terrassa: 41.5600, 2.0100
-- Sabadell: 41.5486, 2.1075

-- Insert 50 new profiles with realistic data around Barcelona
INSERT INTO users (firstName, lastName, email, password, gender, sexualOrientation, age, goal, height, tags, bio, verified, location, locationAccess) VALUES
('Nesta', 'Loisy', 'nesta.loisy@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 18, 'date', 184, 'code', 'I love coding', true, '41.38955,2.17627', true),
-- Potential matches (similar interests and compatible preferences)
('Emma', 'Garcia', 'emma.garcia@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 22, 'date', 165, 'code,music,travel', 'Software developer who loves coding and exploring new places', true, '41.3851,2.1734', true),
('Sofia', 'Martinez', 'sofia.martinez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 20, 'date', 170, 'code,art,photography', 'Creative developer with a passion for photography', true, '41.3597,2.0997', true),
('Lucas', 'Rodriguez', 'lucas.rodriguez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'homosexual', 24, 'date', 180, 'code,gaming,music', 'Full-stack developer and gaming enthusiast', true, '41.4500,2.2472', true),
('Mia', 'Sanchez', 'mia.sanchez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 21, 'date', 168, 'code,travel,food', 'Tech enthusiast who loves to travel and try new cuisines', true, '41.4736,2.0844', true),
('Leo', 'Perez', 'leo.perez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'bisexual', 23, 'date', 175, 'code,music,art', 'Creative developer with a passion for music and art', true, '41.2800,1.9767', true),

-- More potential matches
('Clara', 'Lopez', 'clara.lopez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 19, 'date', 167, 'code,gaming,music', 'Gaming and coding enthusiast', true, '41.5400,2.4450', true),
('Marc', 'Gomez', 'marc.gomez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'homosexual', 25, 'date', 178, 'code,art,photography', 'Artistic developer with a love for photography', true, '41.5600,2.0100', true),
('Julia', 'Fernandez', 'julia.fernandez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 22, 'date', 165, 'code,travel,food', 'Foodie developer who loves to travel', true, '41.5486,2.1075', true),
('Alex', 'Torres', 'alex.torres@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'bisexual', 24, 'date', 180, 'code,music,gaming', 'Gaming developer with a passion for music', true, '41.3851,2.1734', true),
('Nora', 'Diaz', 'nora.diaz@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 20, 'date', 170, 'code,art,photography', 'Creative developer and photography lover', true, '41.3597,2.0997', true),

-- Non-matching profiles (different interests or incompatible preferences)
('Carlos', 'Ruiz', 'carlos.ruiz@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'homosexual', 30, 'friend', 185, 'sports,fitness,travel', 'Fitness enthusiast and travel lover', true, '41.4500,2.2472', true),
('Elena', 'Moreno', 'elena.moreno@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'homosexual', 28, 'friend', 172, 'art,music,photography', 'Artist and music lover', true, '41.4736,2.0844', true),
('David', 'Alvarez', 'david.alvarez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'homosexual', 35, 'friend', 182, 'sports,fitness,travel', 'Sports and fitness enthusiast', true, '41.2800,1.9767', true),
('Laura', 'Jimenez', 'laura.jimenez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'homosexual', 27, 'friend', 168, 'art,music,photography', 'Art and music lover', true, '41.5400,2.4450', true),
('Pablo', 'Romero', 'pablo.romero@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'homosexual', 32, 'friend', 178, 'sports,fitness,travel', 'Fitness and travel enthusiast', true, '41.5600,2.0100', true),

-- More non-matching profiles
('Ana', 'Navarro', 'ana.navarro@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'homosexual', 29, 'friend', 170, 'art,music,photography', 'Artist and photography lover', true, '41.5486,2.1075', true),
('Javier', 'Molina', 'javier.molina@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'homosexual', 31, 'friend', 183, 'sports,fitness,travel', 'Sports and travel enthusiast', true, '41.3851,2.1734', true),
('Carmen', 'Ortega', 'carmen.ortega@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'homosexual', 26, 'friend', 165, 'art,music,photography', 'Art and music lover', true, '41.3597,2.0997', true),
('Diego', 'Serrano', 'diego.serrano@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'homosexual', 33, 'friend', 180, 'sports,fitness,travel', 'Fitness and sports enthusiast', true, '41.4500,2.2472', true),
('Isabel', 'Castro', 'isabel.castro@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'homosexual', 28, 'friend', 172, 'art,music,photography', 'Artist and photography lover', true, '41.4736,2.0844', true),

-- Mixed profiles (some matching characteristics)
('Adrian', 'Vargas', 'adrian.vargas@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 25, 'date', 175, 'code,sports,music', 'Developer who loves sports and music', true, '41.2800,1.9767', true),
('Valeria', 'Reyes', 'valeria.reyes@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 23, 'date', 168, 'code,art,travel', 'Creative developer who loves to travel', true, '41.5400,2.4450', true),
('Hugo', 'Mendez', 'hugo.mendez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 27, 'date', 178, 'code,gaming,sports', 'Gaming developer and sports enthusiast', true, '41.5600,2.0100', true),
('Lucia', 'Herrera', 'lucia.herrera@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 24, 'date', 165, 'code,music,photography', 'Developer with a passion for music and photography', true, '41.5486,2.1075', true),
('Mateo', 'Aguilar', 'mateo.aguilar@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 26, 'date', 180, 'code,art,gaming', 'Artistic developer and gaming enthusiast', true, '41.3851,2.1734', true),

-- More mixed profiles
('Daniela', 'Flores', 'daniela.flores@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 22, 'date', 170, 'code,travel,food', 'Foodie developer who loves to travel', true, '41.3597,2.0997', true),
('Gabriel', 'Ramos', 'gabriel.ramos@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 25, 'date', 175, 'code,music,sports', 'Developer who loves music and sports', true, '41.4500,2.2472', true),
('Sara', 'Soto', 'sara.soto@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 23, 'date', 168, 'code,art,travel', 'Creative developer and travel enthusiast', true, '41.4736,2.0844', true),
('Martin', 'Castillo', 'martin.castillo@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 27, 'date', 178, 'code,gaming,music', 'Gaming developer and music lover', true, '41.2800,1.9767', true),
('Paula', 'Morales', 'paula.morales@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 24, 'date', 165, 'code,music,photography', 'Developer with a passion for music and photography', true, '41.5400,2.4450', true),

-- Additional profiles with various characteristics
('Roberto', 'Ortiz', 'roberto.ortiz@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 28, 'date', 182, 'code,sports,travel', 'Developer and sports enthusiast who loves to travel', true, '41.5600,2.0100', true),
('Eva', 'Gutierrez', 'eva.gutierrez@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 25, 'date', 170, 'code,art,music', 'Creative developer and music lover', true, '41.5486,2.1075', true),
('Raul', 'Cruz', 'raul.cruz@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 26, 'date', 175, 'code,gaming,sports', 'Gaming developer and sports enthusiast', true, '41.3851,2.1734', true),
('Natalia', 'Rojas', 'natalia.rojas@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 23, 'date', 168, 'code,travel,photography', 'Developer who loves to travel and take photos', true, '41.3597,2.0997', true),
('Alberto', 'Mendoza', 'alberto.mendoza@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 27, 'date', 178, 'code,music,gaming', 'Gaming developer and music enthusiast', true, '41.4500,2.2472', true),

-- Final set of profiles
('Cristina', 'Silva', 'cristina.silva@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 24, 'date', 165, 'code,art,music', 'Creative developer and music lover', true, '41.4736,2.0844', true),
('Fernando', 'Vega', 'fernando.vega@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 26, 'date', 180, 'code,sports,gaming', 'Gaming developer and sports enthusiast', true, '41.2800,1.9767', true),
('Beatriz', 'Fuentes', 'beatriz.fuentes@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 25, 'date', 170, 'code,travel,photography', 'Developer who loves to travel and take photos', true, '41.5400,2.4450', true),
('Jorge', 'Carrasco', 'jorge.carrasco@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 28, 'date', 175, 'code,music,sports', 'Developer who loves music and sports', true, '41.5600,2.0100', true),
('Monica', 'Pena', 'monica.pena@example.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'female', 'heterosexual', 23, 'date', 168, 'code,art,travel', 'Creative developer and travel enthusiast', true, '41.5486,2.1075', true);

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