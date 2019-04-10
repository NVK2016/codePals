INSERT INTO codepals_db.activities (adminId, title, description, location, estimateStartDate, actType, active, createdAt, updatedAt)
VALUES (1, "Project Testing", "Short Description here", "San Francisco", 'May 2019', '', true, '2019-04-05 13:17:17', '2019-04-05 13:17:17');

INSERT INTO codepals_db.users (firstname, lastName, email, phone, city, state, active, passw, createdAt, updatedAt)
VALUES ("Joe", "Doe", "jdoe@gmail.com", "", "San Francisco", "CA", true, "123456", '2011-12-18 13:17:17'  ,'2011-12-18 13:17:17');

INSERT INTO codepals_db.users (firstname, lastName, email, phone, city, state, active, passw, createdAt, updatedAt)
VALUES ("Jane", "Smith", "jsm@gmail.com", "", "San Francisco", "CA", true, "abcdfhr", '2019-04-09 13:17:17'  ,'2019-04-09 13:17:17');

INSERT INTO skills(skilltype, skill, createdAt, updatedAt)
values ("Front End" , "HTML" , '2011-12-18 13:17:17'  ,'2011-12-18 13:17:17'),
("Back End" , "Javascript"  ,'2011-12-18 13:17:17'  ,'2011-12-18 13:17:17');

INSERT INTO codepals_db.usersSkills (userId, skillId, hasSkill, createdAt, updatedAt)
VALUES (1, 1, true, '2019-04-05 13:17:17', '2019-04-05 13:17:17');

INSERT INTO codepals_db.usersSkills (userId, skillId, hasSkill, createdAt, updatedAt)
VALUES (1, 2, true, '2019-04-05 13:17:17', '2019-04-05 13:17:17');