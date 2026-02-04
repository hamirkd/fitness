-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 10 avr. 2025 à 02:17
-- Version du serveur :  10.4.18-MariaDB
-- Version de PHP : 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `facture_eau`
--

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datenais` date NOT NULL,
  `lieunais` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observation` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `genre` enum('HOMME','FEMME','ENTREPRISE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeclient` enum('ORDINAIRE','ENTREPRISE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `cnib` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numerocompteur` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ancienindex` int(11) NOT NULL DEFAULT 0,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`id`, `nom`, `prenom`, `datenais`, `lieunais`, `telephone`, `email`, `observation`, `genre`, `typeclient`, `file_name`, `updated_by`, `created_by`, `deleted_at`, `created_at`, `updated_at`, `cnib`, `numerocompteur`, `ancienindex`, `longitude`, `latitude`) VALUES
(1, 'DAO', 'Hamadou', '2025-04-03', 'Ouagadougou', '+226 74359156', 'daohamadou@gmail.com', 'JJJ', 'HOMME', 'ORDINAIRE', '', 1, 1, NULL, '2025-04-03 15:16:29', '2025-04-03 23:30:38', 'B24650039', '00001', 15, NULL, NULL),
(2, 'DABIRE', 'Julia', '2025-04-03', 'Test', NULL, NULL, NULL, 'FEMME', 'ORDINAIRE', '', 1, 1, NULL, '2025-04-03 22:45:20', '2025-04-10 00:11:10', NULL, '0001', 0, -1.5637188, 12.4170264);

-- --------------------------------------------------------

--
-- Structure de la table `factures`
--

CREATE TABLE `factures` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `nom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numerocompteur` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeclient` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `periode` date NOT NULL,
  `ancienindex` int(11) DEFAULT NULL,
  `nouveauindex` int(11) DEFAULT NULL,
  `consommation` int(11) DEFAULT NULL,
  `prixunitaire` int(11) DEFAULT NULL,
  `tarif_id` int(11) DEFAULT NULL,
  `montant` int(11) DEFAULT NULL,
  `redevance` int(11) DEFAULT NULL,
  `montanttotal` int(11) DEFAULT NULL,
  `etat` enum('NONPAYE','PAYE','ANNULE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `datepaiement` datetime DEFAULT NULL,
  `dateecheance` date DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `motif` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `factures`
--

INSERT INTO `factures` (`id`, `client_id`, `nom`, `prenom`, `numerocompteur`, `typeclient`, `periode`, `ancienindex`, `nouveauindex`, `consommation`, `prixunitaire`, `tarif_id`, `montant`, `redevance`, `montanttotal`, `etat`, `datepaiement`, `dateecheance`, `updated_by`, `created_by`, `deleted_at`, `created_at`, `updated_at`, `cancelled_at`, `motif`) VALUES
(1, 1, 'DAO', 'Hamadou', '00001', 'ORDINAIRE', '2025-04-01', 0, 100, 100, 2000, 1, 200000, 1000, 201000, 'NONPAYE', NULL, NULL, 1, 1, '2025-04-03 22:55:27', '2025-04-03 20:47:39', '2025-04-03 22:55:27', '0000-00-00 00:00:00', NULL),
(2, 1, 'DAO', 'Hamadou', '00001', '', '2025-03-01', 0, 2, 2, 2000, 1, 4000, 1000, 5000, 'PAYE', NULL, NULL, 1, 1, '2025-04-03 23:25:55', '2025-04-03 22:45:37', '2025-04-03 23:25:55', '0000-00-00 00:00:00', NULL),
(3, 2, 'TRAORE', 'Lilly', '0001', '', '2025-03-01', 15, 19, 4, 2000, 1, 8000, 1000, 9000, 'PAYE', NULL, NULL, 1, 1, '2025-04-03 23:25:55', '2025-04-03 22:45:37', '2025-04-03 23:25:55', '0000-00-00 00:00:00', NULL),
(4, 1, 'DAO', 'Hamadou', '', 'ORDINAIRE', '2025-04-01', 0, NULL, NULL, 2000, 1, NULL, 1000, NULL, 'PAYE', '2025-04-03 23:15:06', NULL, 1, 1, '2025-04-09 23:53:29', '2025-04-03 22:55:27', '2025-04-09 23:53:29', '0000-00-00 00:00:00', NULL),
(5, 2, 'TRAORE', 'Lilly', '0001', 'ORDINAIRE', '2025-04-01', 15, NULL, NULL, 2000, 1, NULL, 1000, NULL, 'NONPAYE', NULL, NULL, 1, 1, '2025-04-09 23:49:58', '2025-04-03 22:55:27', '2025-04-09 23:49:58', '2025-04-09 23:49:31', 'Tssttt'),
(6, 1, 'DAO', 'Hamadou', '', 'ORDINAIRE', '2025-02-01', 0, NULL, NULL, 2000, 1, NULL, 1000, NULL, 'NONPAYE', NULL, NULL, 1, 1, NULL, '2025-04-03 23:17:25', '2025-04-09 23:49:51', NULL, NULL),
(7, 2, 'TRAORE', 'Lilly', '', 'ORDINAIRE', '2025-02-01', 15, NULL, NULL, 2000, 1, NULL, 1000, NULL, 'NONPAYE', NULL, NULL, 1, 1, NULL, '2025-04-03 23:17:25', '2025-04-09 23:49:48', NULL, NULL),
(8, 1, 'DAO', 'Hamadou', '00001', 'ORDINAIRE', '2025-03-01', 0, 15, 15, 2000, 1, 30000, 1000, 31000, 'NONPAYE', NULL, NULL, 1, 1, NULL, '2025-04-03 23:25:55', '2025-04-09 23:49:45', NULL, NULL),
(9, 2, 'TRAORE', 'Lilly', '0001', 'ORDINAIRE', '2025-03-01', 15, 20, 5, 2000, 1, 10000, 1000, 11000, 'NONPAYE', NULL, NULL, 1, 1, NULL, '2025-04-03 23:25:55', '2025-04-09 23:49:42', NULL, NULL),
(10, 1, 'DAO', 'Hamadou', '', 'ORDINAIRE', '2025-05-01', 15, NULL, NULL, 2000, 1, NULL, 1000, NULL, 'NONPAYE', NULL, NULL, 1, 1, '2025-04-09 23:53:05', '2025-04-09 23:52:27', '2025-04-09 23:53:05', '2025-04-09 23:53:02', 'kk'),
(11, 2, 'TRAORE', 'Lilly', '', 'ORDINAIRE', '2025-05-01', 0, NULL, NULL, 2000, 1, NULL, 1000, NULL, 'NONPAYE', NULL, NULL, 1, 1, '2025-04-09 23:53:11', '2025-04-09 23:52:27', '2025-04-09 23:53:11', '2025-04-09 23:53:08', 'kk'),
(12, 1, 'DAO', 'Hamadou', '', 'ORDINAIRE', '2025-04-01', 15, NULL, NULL, 2000, 1, NULL, 1000, NULL, 'NONPAYE', NULL, NULL, 1, 1, NULL, '2025-04-09 23:53:29', '2025-04-09 23:53:29', NULL, NULL),
(13, 2, 'TRAORE', 'Lilly', '', 'ORDINAIRE', '2025-04-01', 0, NULL, NULL, 2000, 1, NULL, 1000, NULL, 'NONPAYE', NULL, NULL, 1, 1, NULL, '2025-04-09 23:53:29', '2025-04-09 23:53:29', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `medias`
--

CREATE TABLE `medias` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type_documents` enum('DOSSIERS_CLIENTS') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int(11) NOT NULL,
  `libelle_document` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `medias`
--

INSERT INTO `medias` (`id`, `type_documents`, `parent_id`, `libelle_document`, `file_name`, `updated_by`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'DOSSIERS_CLIENTS', 2, 'Test', '1744243650.pdf', NULL, NULL, '2025-04-10 00:07:31', '2025-04-10 00:07:31', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2022_08_01_212659_create_tarifs_table', 1),
(4, '2022_08_01_215157_create_versements_table', 1),
(5, '2022_10_09_202739_create_clients_table', 1),
(6, '2022_10_09_202739_create_factures_table', 1),
(7, '2023_01_05_094406_create_medias_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `tarifs`
--

CREATE TABLE `tarifs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `typetarif` enum('ENTREPRISE','ORDINAIRE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `montant` int(11) NOT NULL DEFAULT 0,
  `redevance` int(11) NOT NULL DEFAULT 0,
  `autres_frais` int(11) NOT NULL DEFAULT 0,
  `updated_by` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tarifs`
--

INSERT INTO `tarifs` (`id`, `typetarif`, `montant`, `redevance`, `autres_frais`, `updated_by`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'ORDINAIRE', 2000, 1000, 0, NULL, NULL, '2025-04-03 19:53:38', '2025-04-03 19:53:38'),
(3, 'ENTREPRISE', 5000, 1000, 0, 1, 1, '2025-04-03 20:39:49', '2025-04-03 20:41:49');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN','SCOLARITE','DIRECTEUR','ENSEIGNANT','SECRETARIAT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `avatar`, `email_verified_at`, `password`, `first_name`, `last_name`, `telephone`, `role`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'daohamadou@gmail.com', NULL, NULL, '$2y$10$XgXoO6V60iQZmwco7lKgle3fnnpC/tpzBmJ0Vu5tsx2lmMyTd2PlW', 'Hamadou', 'DAO', '74359156', 'ADMIN', NULL, '2022-01-25 16:09:12', '2022-01-25 16:09:12', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `versements`
--

CREATE TABLE `versements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` int(11) NOT NULL,
  `facture_id` int(11) DEFAULT NULL,
  `montant` int(11) NOT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `dateversement` datetime DEFAULT NULL,
  `motif` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `factures`
--
ALTER TABLE `factures`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `medias`
--
ALTER TABLE `medias`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Index pour la table `tarifs`
--
ALTER TABLE `tarifs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Index pour la table `versements`
--
ALTER TABLE `versements`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `factures`
--
ALTER TABLE `factures`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `medias`
--
ALTER TABLE `medias`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `tarifs`
--
ALTER TABLE `tarifs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `versements`
--
ALTER TABLE `versements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
