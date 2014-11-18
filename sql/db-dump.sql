-- phpMyAdmin SQL Dump
-- version 4.2.0
-- http://www.phpmyadmin.net
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 11 nov 2014 kl 22:05
-- Serverversion: 5.6.17
-- PHP-version: 5.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databas: `webshop`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `pcategories`
--

CREATE TABLE IF NOT EXISTS `pcategories` (
`id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumpning av Data i tabell `pcategories`
--

INSERT INTO `pcategories` (`id`, `name`, `description`) VALUES
(1, 'Teddybears', '<p>Fluffy, lovely and irresistible.</p><p>Our cute Teddybears are all made in China of the finest material.</p>'),
(2, 'Elephants', '<p>Sturdy, grey and irresistible.</p><p>Our plastic Elephants are all made in China of the finest material.</p>'),
(3, 'Strange things', '<p>Really strange things in sturdy plastic.</p>');

-- --------------------------------------------------------

--
-- Tabellstruktur `products`
--

CREATE TABLE IF NOT EXISTS `products` (
`id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int(255) DEFAULT NULL,
  `description` text,
  `catid` int(11) DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Dumpning av Data i tabell `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `catid`) VALUES
(1, 'Yellow Teddybear', 99, 'A yellow teddybear.', 1),
(2, 'Pink Teddybear', 120, 'A pink teddybear.', 1),
(3, 'Yellow Submarine', 300, 'A yellow submarine.', 3),
(5, 'Small Elephant', 75, 'A small elephant.', 2),
(6, 'Medium Elephant', 155, 'A medium elephant.', 2),
(7, 'Bazooka', 1000, 'A really large Bazooka.', 3),
(8, 'Black Teddy', 400, 'A rare Teddybear.', 1),
(9, 'Brown Teddybear', 232, 'A new color.', NULL),
(10, 'White Teddybear', 295, 'White and clean', NULL),
(11, 'Gray Teddybear', 50, 'A grey teddybear', 1);

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `pcategories`
--
ALTER TABLE `pcategories`
 ADD PRIMARY KEY (`id`);

--
-- Index för tabell `products`
--
ALTER TABLE `products`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `pcategories`
--
ALTER TABLE `pcategories`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT för tabell `products`
--
ALTER TABLE `products`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
