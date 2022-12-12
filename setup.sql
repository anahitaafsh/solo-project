CREATE USER webappdbuser WITH PASSWORD='UGMrrkRU5F84nzXA'

EXECUTE sp_addrolemember db_datareader, "webappdbuser"
EXECUTE sp_addrolemember db_datawriter, "webappdbuser"

CREATE TABLE users
(
    id INT IDENTITY PRIMARY KEY,
    fname nvarchar(255),
    lname nvarchar(255), 
    email nvarchar(255)
);

INSERT INTO users VALUES 
(
    'Jane', 'Austen', 'jausten@microsoft.com'
),
(
    'Ernest', 'Hemingway', 'ehemingway@microsoft.com'
),
(
    'Philip', 'Roth', 'proth@microsoft.com'
)

select * from users
DELETE FROM users WHERE lname='Afshari'