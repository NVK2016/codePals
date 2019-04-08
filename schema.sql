--Dropping database 
DROP DATABASE IF EXISTS codepals_db; 
--Create Database structure for sequelize to create models within it. 
CREATE DATABASE codepals_db; 





Executing (default): CREATE TABLE IF NOT EXISTS `usersActivities`
 (`userId` INTEGER NOT NULL , `activityId` INTEGER NOT NULL ,
  `interested` TINYINT(1) DEFAULT false, `createdAt` DATETIME NOT NULL, 
  `updatedAt` DATETIME NOT NULL, 
  UNIQUE `usersActivities_userId_activityId_unique` (`userId`, `activityId`), 
  PRIMARY KEY (`userId`, `activityId`),
   FOREIGN KEY (`userId`) REFERENCES `users` (`id`) 
   ON DELETE CASCADE ON UPDATE CASCADE, 
   FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) 
   ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;




Executing (default): CREATE TABLE IF NOT EXISTS `usersSkills`
 (`userId` INTEGER NOT NULL , `skillId` INTEGER NOT NULL , 
 `hasSkill` TINYINT(1) DEFAULT false, `createdAt` DATETIME NOT NULL, 
 `updatedAt` DATETIME NOT NULL,
  UNIQUE `usersSkills_userId_skillId_unique` (`userId`, `skillId`), 
  PRIMARY KEY (`userId`, `skillId`), 
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) 
  ON DELETE CASCADE ON UPDATE CASCADE, 
  FOREIGN KEY (`skillId`) REFERENCES `skills` (`id`) 
  ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;


