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
('Nesta', 'Loisy', 'nesta.loisy@gmail.com', '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy', 'male', 'heterosexual', 18, 'date', 184, 'code', 'I love coding', true, '41.38955,2.17627', true);


DO $$
DECLARE
    i INTEGER;
    firstname_arr TEXT[] := ARRAY['Jordi', 'Maria', 'Marc', 'Laia', 'Pol', 'Emma', 'Alex', 'Anna', 'Pau', 'Clara',
                               'Martí', 'Júlia', 'Jan', 'Carla', 'Arnau', 'Aina', 'Biel', 'Ona', 'Oriol', 'Noa',
                               'Gerard', 'Ariadna', 'Sergi', 'Laura', 'David', 'Paula', 'Xavier', 'Marina', 'Eduardo', 'Helena',
                               'Cristian', 'Sara', 'Miguel', 'Diana', 'Alberto', 'Lucia', 'Javier', 'Carmen', 'Francisco', 'Silvia',
                               'Eric', 'Eva', 'Daniel', 'Isabel', 'Josep', 'Nuria', 'Antoni', 'Montserrat', 'Santiago', 'Elena'];
    
    lastname_arr TEXT[] := ARRAY['Garcia', 'Martinez', 'Lopez', 'Rodriguez', 'Fernandez', 'Gonzalez', 'Sanchez', 'Perez', 'Martin', 'Gomez',
                               'Puig', 'Vila', 'Serra', 'Font', 'Soler', 'Ferrer', 'Vidal', 'Marti', 'Roca', 'Torres',
                               'Romero', 'Navarro', 'Ortega', 'Jimenez', 'Ruiz', 'Moreno', 'Diaz', 'Muñoz', 'Alvarez', 'Gutierrez',
                               'Hernandez', 'Sanz', 'Roig', 'Bosch', 'Costa', 'Pons', 'Pujol', 'Casas', 'Morera', 'Escudero',
                               'Castillo', 'Blanco', 'Domenech', 'Mas', 'Ribas', 'Trias', 'Ros', 'Batlle', 'Miro', 'Sala'];
    
    gender_arr TEXT[] := ARRAY['male', 'female', 'non-binary', 'other'];
    
    orientation_arr TEXT[] := ARRAY['heterosexual', 'homosexual', 'bisexual', 'pansexual', 'demisexual', 'asexual'];
    
    goal_arr TEXT[] := ARRAY['date', 'friendship', 'relationship', 'casual', 'networking'];
    
    tag_arr TEXT[] := ARRAY['music', 'art', 'sports', 'food', 'travel', 'books', 'movies', 'gaming', 'fitness', 'yoga',
                           'cooking', 'photography', 'hiking', 'dancing', 'animals', 'technology', 'fashion', 'science',
                           'philosophy', 'politics', 'cycling', 'swimming', 'running', 'football', 'basketball', 'tennis'];
    
    bio_arr TEXT[] := ARRAY[
        'I love exploring the streets of Barcelona and finding hidden spots. Looking for someone to share adventures with.',
        'Barcelona has been my home for several years. I enjoy the beach and nightlife in my free time.',
        'Just moved to this beautiful city few months ago. Would love to meet locals and learn more about the culture.',
        'I work as a designer and spend my weekends at local markets. Loving life in Barcelona!',
        'Born and raised in Barcelona. If you want to know the best tapas spots, I''m your guide!',
        'Split my time between work and exploring what the city has to offer. Passionate about art and music.',
        'When I''m not at the beach, you can find me at local galleries. Barcelona is the perfect city for my lifestyle.',
        'Living the Mediterranean life in beautiful Barcelona. Looking for someone who appreciates good food as much as I do.',
        'I''m all about good food, great company, and beautiful sunsets by the sea.',
        'Architect by day, foodie by night. Let''s meet for a coffee or a vermouth!'
    ];
    
    neighborhood_names TEXT[] := ARRAY['Barceloneta', 'Gothic Quarter', 'Eixample', 'Gracia', 'Poblenou', 'Sants', 
                                     'Sant Andreu', 'Sarrià-Sant Gervasi', 'Horta-Guinardó', 'Les Corts'];
    
    neighborhood_lats DECIMAL[] := ARRAY[41.3807, 41.3833, 41.3918, 41.4021, 41.4036, 41.3751, 41.4334, 41.4012, 41.4192, 41.3833];
    neighborhood_lngs DECIMAL[] := ARRAY[2.1899, 2.1765, 2.1671, 2.1530, 2.2005, 2.1399, 2.1889, 2.1363, 2.1681, 2.1343];
    
    -- Variables for user generation
    first_name TEXT;
    last_name TEXT;
    email TEXT;
    password TEXT := '$2a$10$haI2UWxRB.F1j6PMOe99D.J3mhq.vNa2mPrbXBwECIAzn/g8oJgMy'; -- Reusing your hashed password
    provider TEXT := 'local';
    gender TEXT;
    sexual_orientation TEXT;
    age INTEGER;
    goal TEXT;
    height INTEGER;
    tags TEXT;
    bio TEXT;
    nb_photos INTEGER;
    location TEXT;
    location_access BOOLEAN;
    fame INTEGER;
    verified BOOLEAN;
    
    num_tags INTEGER;
    tag_selection TEXT[];
    
    neighborhood_idx INTEGER;
    base_lat DECIMAL;
    base_lng DECIMAL;
    rand_lat DECIMAL;
    rand_lng DECIMAL;
    
BEGIN
    FOR i IN 1..500 LOOP
        first_name := firstname_arr[1 + floor(random() * array_length(firstname_arr, 1))];
        last_name := lastname_arr[1 + floor(random() * array_length(lastname_arr, 1))];
        email := lower(first_name) || '.' || lower(last_name) || floor(random() * 1000) || '@example.com';
        gender := gender_arr[1 + floor(random() * array_length(gender_arr, 1))];
        sexual_orientation := orientation_arr[1 + floor(random() * array_length(orientation_arr, 1))];
        age := 18 + floor(random() * 47);
        goal := goal_arr[1 + floor(random() * array_length(goal_arr, 1))];
        height := 150 + floor(random() * 51);
        
        num_tags := 2 + floor(random() * 4);
        tag_selection := ARRAY[]::TEXT[];
        
        FOR j IN 1..num_tags LOOP
            tag_selection := array_append(tag_selection, tag_arr[1 + floor(random() * array_length(tag_arr, 1))]);
        END LOOP;
        
        tag_selection := ARRAY(SELECT DISTINCT unnest FROM unnest(tag_selection));
        tags := array_to_string(tag_selection, ',');
        
        bio := bio_arr[1 + floor(random() * array_length(bio_arr, 1))];
        
        nb_photos := 1 + floor(random() * 5);
        
        neighborhood_idx := 1 + floor(random() * array_length(neighborhood_names, 1));
        base_lat := neighborhood_lats[neighborhood_idx];
        base_lng := neighborhood_lngs[neighborhood_idx];
        
        rand_lat := base_lat + (random() * 0.02 - 0.01);
        rand_lng := base_lng + (random() * 0.02 - 0.01);
        location := rand_lat::TEXT || ',' || rand_lng::TEXT;
        
        location_access := random() > 0.3;
        fame := 10 + floor(random() * 81);
        verified := random() > 0.2;
        
        INSERT INTO users (
            firstName, lastName, email, password, provider, gender, sexualOrientation, 
            age, goal, height, tags, bio, nb_photos, location, city, 
            locationAccess, fame, verified
        ) VALUES (
            first_name, last_name, email, password, provider, gender, sexual_orientation,
            age, goal, height, tags, bio, nb_photos, location, 'Barcelona',
            location_access, fame, verified
        );
        
    END LOOP;
END $$;