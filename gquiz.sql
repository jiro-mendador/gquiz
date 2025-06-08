-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2025 at 10:27 AM
-- Server version: 10.11.12-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gquiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_course`
--

CREATE TABLE `api_course` (
  `id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `api_course`
--

INSERT INTO `api_course` (`id`, `name`) VALUES
(1, 'BSCS'),
(2, 'BSIT');

-- --------------------------------------------------------

--
-- Table structure for table `api_quiz`
--

CREATE TABLE `api_quiz` (
  `id` bigint(20) NOT NULL,
  `quiz_start_date` datetime(6) NOT NULL,
  `quiz_end_date` datetime(6) NOT NULL,
  `title` varchar(150) NOT NULL,
  `instructions` longtext NOT NULL,
  `subject_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `api_quiz`
--

INSERT INTO `api_quiz` (`id`, `quiz_start_date`, `quiz_end_date`, `title`, `instructions`, `subject_id`) VALUES
(20, '2025-06-09 07:58:00.000000', '2025-06-09 15:59:00.000000', 'CSC Quiz', 'CSC Quiz', 10);

-- --------------------------------------------------------

--
-- Table structure for table `api_quizattempt`
--

CREATE TABLE `api_quizattempt` (
  `id` bigint(20) NOT NULL,
  `attempt_date` datetime(6) NOT NULL,
  `quiz_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `answer_id` bigint(20) DEFAULT NULL,
  `question_id` bigint(20) NOT NULL,
  `submission_id` bigint(20) NOT NULL,
  `input_answer` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_quizchoice`
--

CREATE TABLE `api_quizchoice` (
  `id` bigint(20) NOT NULL,
  `choice` longtext NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `question_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `api_quizchoice`
--

INSERT INTO `api_quizchoice` (`id`, `choice`, `is_correct`, `question_id`) VALUES
(80, 'Commission on Elections', 1, 39),
(81, 'The Senate President', 0, 78),
(82, 'true', 1, 80),
(83, 'The Chief Justice', 0, 78),
(84, 'Employees can be dismissed at any time without cause', 0, 79),
(85, 'Fifty Percent', 0, 38),
(86, 'false', 0, 80),
(87, 'Republic Act Number One', 0, 37),
(88, 'The President of the Philippines', 1, 78),
(89, 'Sixty Percent', 0, 38),
(90, 'Employees are protected from arbitrary dismissal and can only be removed for just cause and with due process', 1, 79),
(91, 'The Speaker of the House', 0, 78),
(92, 'The Philippine Constitution', 1, 37),
(93, 'Eighty Percent', 1, 38),
(94, 'Security of tenure only applies to high-ranking officials', 0, 79),
(95, 'Seventy Percent', 0, 38),
(96, 'Executive Order Number One', 0, 37),
(97, 'Security of tenure is not a relevant concept in the civil service', 0, 79),
(98, 'Civil Service Decree Number One', 0, 37),
(99, 'The Civil Service Law', 1, 82),
(100, 'csc.gov.ph', 1, 41),
(101, 'Rewarding political supporters with government positions regardless of qualifications, undermining meritocracy', 1, 81),
(102, 'A system of promoting employees based on seniority', 0, 81),
(103, 'A program to improve employee morale through fun activities', 0, 81),
(104, 'true', 1, 83),
(105, 'All government employees', 0, 40),
(106, 'Allowing employees to take home office supplies', 0, 81),
(107, 'true', 0, 42),
(108, 'false', 0, 83),
(109, 'Elected officials', 1, 40),
(110, 'false', 1, 42),
(111, 'Contractual employees', 0, 40),
(112, 'true', 1, 44),
(113, 'All of the choices', 0, 40),
(114, 'false', 0, 44),
(115, 'Dishonesty', 0, 43),
(116, 'Insubordination', 0, 43),
(117, 'Expressing a dissenting opinion within proper channels', 1, 43),
(118, 'Legislative Branch', 0, 47),
(119, 'Neglect of duty', 0, 43),
(120, 'To provide legal assistance to government employees', 0, 45),
(121, 'Judicial Branch', 0, 47),
(122, 'To administer civil service examinations and ensure merit-based recruitment', 1, 45),
(123, 'Executive Branch', 0, 47),
(124, 'true', 0, 49),
(125, 'To oversee infrastructure projects of the government', 0, 45),
(126, 'Statement of Assets, Liabilities, and Net Worth', 1, 48),
(127, 'false', 1, 49),
(128, 'To regulate private businesses in the Philippines', 0, 45),
(129, 'Any Comfortable Clothing', 0, 46),
(130, 'It is an independent constitutional commission', 1, 47),
(131, 'Formal Attire', 0, 46),
(132, 'Polo Shirt or blouse with collar, dark pants or skirt, and closed shoes', 1, 46),
(133, 'Shorts and slippers', 0, 46),
(134, 'Giving preferential treatment to certain groups', 0, 51),
(135, 'To investigate corruption cases', 0, 50),
(136, 'Discriminating against qualified applicants', 0, 51),
(137, 'To provide training and development programs for civil servants', 1, 50),
(138, 'Ensuring fair access and treatment for all qualified individuals', 1, 51),
(139, 'To handle grievances and disputes between government employees and management', 1, 55),
(140, 'Government jobs are temporary', 0, 52),
(141, 'To oversee government infrastructure projects', 0, 55),
(142, 'Guaranteeing employment for everyone', 0, 51),
(143, 'To administer the Civil Service Exam', 0, 50),
(144, 'Career positions are temporary, non-career positions are permanent', 0, 53),
(145, 'Employees are promoted based on seniority only', 0, 52),
(146, 'To regulate private sector labor unions', 0, 55),
(147, 'Career positions require civil service eligibility, non-career positions do not always', 1, 53),
(148, 'To lobby for higher salaries for government employees', 0, 50),
(149, 'Opportunities for advancement based on merit and performance', 1, 52),
(150, 'Hiring unqualified individuals', 0, 54),
(151, 'To set the minimum wage for government employees', 0, 55),
(152, 'Non-Career positions are usually confidential in nature', 0, 53),
(153, 'Non-Career positions have fixed terms', 0, 53),
(154, 'Lateral Entry', 0, 52),
(155, 'Showing favoritism to relatives in hiring and promotion', 1, 54),
(156, 'Following proper recruitment procedures', 0, 54),
(157, 'Discrimination based on gender', 0, 54),
(158, 'Hiring based on political connections', 0, 57),
(159, 'true', 0, 56),
(160, 'Hiring based on seniority alone', 0, 57),
(161, 'false', 1, 56),
(162, 'Hiring based on qualifications and competence', 1, 57),
(163, 'Those performing proprietary functions', 1, 59),
(164, 'true', 0, 60),
(165, 'Hiring based on ethnicity', 0, 57),
(166, 'false', 1, 60),
(167, 'To encourage corruption', 0, 58),
(168, 'To promote ethical behavior and accountability in government service', 1, 58),
(169, 'An employee is given a higher salary', 0, 61),
(170, 'To limit freedom of speech for government employees', 0, 58),
(171, 'The position is allocated to a higher grade', 1, 61),
(172, 'To protect government officials from criticism', 0, 58),
(173, 'An employee is transferred', 0, 61),
(174, 'All of the choices', 0, 61),
(175, 'A Chairperson and two Commissioners', 1, 64),
(176, 'To punish poor performing employees', 0, 62),
(177, 'To provide opportunities for professional development and improve employee performance', 1, 62),
(178, 'Transparency, Accountability, and Efficiency', 1, 65),
(179, 'To reduce government spending', 0, 62),
(180, 'Restricts the public\'s access to government information', 0, 63),
(181, 'Secrecy, Discretion, and Speed', 0, 65),
(182, 'To delay promotion of employees', 0, 62),
(183, 'Grants citizens access to official government information, with certain exceptions', 1, 63),
(184, 'Authority, Power, Control', 0, 65),
(185, 'Requires all government documents to be classified as confidential', 0, 63),
(186, 'Economy, Efficiency, Effectiveness', 0, 65),
(187, 'true', 1, 67),
(188, 'The Official Gazette', 1, 69),
(189, 'Only applies to national government agencies', 0, 63),
(190, 'false', 0, 67),
(191, 'Professional and Subprofessional', 1, 66),
(192, 'Professional and Nonprofessional', 0, 66),
(193, 'Career and Non-Career', 0, 66),
(194, 'Expert and Beginner', 0, 66),
(195, 'true', 0, 68),
(196, 'Termination from office', 1, 70),
(197, 'false', 1, 68),
(198, 'Suspension from office', 0, 70),
(199, 'true', 0, 74),
(200, 'true', 1, 75),
(201, 'Promotion from office', 0, 70),
(202, 'false', 1, 74),
(203, 'false', 0, 75),
(204, 'Social Security System', 0, 71),
(205, 'Reinstatement to Office', 0, 70),
(206, 'Government Service Insurance System', 1, 71),
(207, 'Philippine Health Insurance Corporation', 0, 71),
(208, 'Home Development Mutual Fund', 0, 71),
(209, 'Republic Act Number Nine One Eight Four', 1, 77),
(210, 'Conflict of interest is always permitted', 0, 72),
(211, 'Civil servants must disclose and avoid situations where personal interests conflict with their public duties', 1, 72),
(212, 'Absence without official leave', 0, 73),
(213, 'Conflict of interest is only a concern for high-ranking officials', 0, 72),
(214, 'Separation from the service', 1, 73),
(215, 'Providing legal assistance to employees facing charges', 1, 76),
(216, 'Civil servants can resolve conflicts of interest privately', 0, 72),
(217, 'Rehiring of an employee', 0, 73),
(218, 'Lobbying for higher salaries', 0, 76),
(219, 'Training an employee', 0, 73),
(220, 'Conducting employee satisfaction surveys', 0, 76),
(221, 'Promoting employee health and wellness programs', 0, 76);

-- --------------------------------------------------------

--
-- Table structure for table `api_quizquestion`
--

CREATE TABLE `api_quizquestion` (
  `id` bigint(20) NOT NULL,
  `question` longtext NOT NULL,
  `question_type` varchar(20) NOT NULL,
  `quiz_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `api_quizquestion`
--

INSERT INTO `api_quizquestion` (`id`, `question`, `question_type`, `quiz_id`) VALUES
(37, 'What is the legal basis for the existence of the Civil Service Commission?', 'multiple_choice', 20),
(38, 'What is the general passing rate in the civil service exam?', 'multiple_choice', 20),
(39, 'What is the meaning of COMELEC?', 'identification', 20),
(40, 'Who are exempted from taking the Civil Service Examination?', 'multiple_choice', 20),
(41, 'What is the official website of the Civil Service Commission?', 'identification', 20),
(42, 'True or false: A civil servant can be terminated for expressing personal opinions on social media.', 'true_false', 20),
(43, 'Which of the following is NOT a ground for disciplinary action against a civil servant?', 'multiple_choice', 20),
(44, 'True or False: Government officials and employees must declare all their assets, liabilities, and net worth annually.', 'true_false', 20),
(45, 'The Civil Service Commission is the central personnel agency of the Philippine government. What is its primary role?', 'multiple_choice', 20),
(46, 'What is the appropriate attire for taking the Civil Service Exam?', 'multiple_choice', 20),
(47, 'Which branch of the government is the Civil Service Commission under?', 'multiple_choice', 20),
(48, 'What is the full meaning of SALN?', 'identification', 20),
(49, 'True or false: A civil servant can engage in partisan political activity while on duty.', 'true_false', 20),
(50, 'What is the primary function of the Civil Service Institute?', 'multiple_choice', 20),
(51, 'What does the principle of \'equal opportunity\' mean in the context of civil service?', 'multiple_choice', 20),
(52, 'The Civil Service Commission promotes the concept of a \'career service\'. What does this mean?', 'multiple_choice', 20),
(53, 'What is the difference between a \'career\' and \'non-career\' service position?', 'multiple_choice', 20),
(54, 'What is nepotism in the context of civil service?', 'multiple_choice', 20),
(55, 'What is the role of the Public Sector Labor-Management Council?', 'multiple_choice', 20),
(56, 'True or false: Government employees are allowed to accept gifts of significant value from individuals or entities they deal with in their official capacity.', 'true_false', 20),
(57, 'What is the concept of merit and fitness in the civil service?', 'multiple_choice', 20),
(58, 'What is the purpose of the Code of Conduct and Ethical Standards for Public Officials and Employees (Republic Act Number Six Seven One Three)?', 'multiple_choice', 20),
(59, 'The CSC has jurisdiction over all government agencies except:', 'identification', 20),
(60, 'True or False: A government employee can own a business, even if it directly conflicts with their government duties.', 'true_false', 20),
(61, 'What is the process of reclassification of position?', 'multiple_choice', 20),
(62, 'What is the purpose of the Performance Management System in the Civil Service?', 'multiple_choice', 20),
(63, 'What is the Freedom of Information (FOI) Executive Order (Executive Order Number Two)?', 'multiple_choice', 20),
(64, 'The Civil Service Commission is headed by:', 'identification', 20),
(65, 'What are the three pillars of good governance that the CSC champion?', 'multiple_choice', 20),
(66, 'What are the different career service examinations offered by CSC?', 'multiple_choice', 20),
(67, 'True or false: Government employees can only be removed from service for just cause and after due process.', 'true_false', 20),
(68, 'True or false: Civil servants are allowed to solicit contributions for charitable purposes from their subordinates.', 'true_false', 20),
(69, 'What is the official gazette of the Philippine Government?', 'identification', 20),
(70, 'What is the effect of resignation?', 'multiple_choice', 20),
(71, 'What is the government agency that handles the retirement of government employees?', 'multiple_choice', 20),
(72, 'What is the rule on conflict of interest for civil servants?', 'multiple_choice', 20),
(73, 'What is the effect of dropping from the rolls?', 'multiple_choice', 20),
(74, 'True or false: Civil servants can be held liable for actions taken in good faith while performing their official duties.', 'true_false', 20),
(75, 'True or False: Civil servants are mandated to participate in continuing professional development programs.', 'true_false', 20),
(76, 'The Civil Service Commission has a mandate to promote the welfare of government employees. What are some ways it does this?', 'multiple_choice', 20),
(77, 'What is the Government Procurement Reform Act?', 'identification', 20),
(78, 'Who appoints the Chairman of the Civil Service Commission?', 'multiple_choice', 20),
(79, 'What is the concept of security of tenure in the civil service?', 'multiple_choice', 20),
(80, 'True or False: Civil servants are allowed to engage in private practice of their profession if it does not interfere with their government duties.', 'true_false', 20),
(81, 'What is the \'spoils system\' and why is it discouraged in the Civil Service?', 'multiple_choice', 20),
(82, 'What is the Pendleton Act equivalent of the Philippines?', 'identification', 20),
(83, 'True or false: The Civil Service Commission has the power to investigate and adjudicate administrative cases involving government employees.', 'true_false', 20);

-- --------------------------------------------------------

--
-- Table structure for table `api_quizsubmission`
--

CREATE TABLE `api_quizsubmission` (
  `id` bigint(20) NOT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `quiz_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_studentcourseyearsection`
--

CREATE TABLE `api_studentcourseyearsection` (
  `id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `year_section_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `api_studentcourseyearsection`
--

INSERT INTO `api_studentcourseyearsection` (`id`, `course_id`, `student_id`, `year_section_id`) VALUES
(14, 1, 41, 14),
(17, 1, 42, 17),
(18, 1, 42, 13),
(19, 1, 43, 13),
(20, 1, 44, 18),
(21, 2, 45, 14);

-- --------------------------------------------------------

--
-- Table structure for table `api_subject`
--

CREATE TABLE `api_subject` (
  `id` bigint(20) NOT NULL,
  `subject_code` varchar(50) NOT NULL,
  `description` varchar(150) NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `year` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `api_subject`
--

INSERT INTO `api_subject` (`id`, `subject_code`, `description`, `teacher_id`, `course_id`, `year`) VALUES
(10, 'CCS-101', 'Computer Programming 1', 37, 1, '1'),
(13, 'CCS-102', 'Computer Programming 2', 40, 1, '2');

-- --------------------------------------------------------

--
-- Table structure for table `api_user`
--

CREATE TABLE `api_user` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `api_user`
--

INSERT INTO `api_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `is_staff`, `is_active`, `date_joined`, `first_name`, `last_name`, `middle_name`, `email`, `role`) VALUES
(14, 'pbkdf2_sha256$1000000$KOTRYEa8r8KRgT46SQF7sk$xQZs4cSvrEyvRb/gyMrOUcob0lk2wWroZNTF+L+na44=', '2025-06-08 07:31:30.229989', 0, 'superadmin_01', 0, 1, '2025-06-06 10:21:16.954629', 'SUPER', 'ADMIN', 'SUPER', 'superadmin@email.com', 'admin'),
(36, 'pbkdf2_sha256$1000000$3PuQ1t1BRtxtxtfMytmbGM$wov7Tjg4eNvrsLPvFzZZGwKXEEKn8ZYKTbPQowdUiDo=', NULL, 0, 'secondaryadmin_01', 0, 1, '2025-06-08 05:47:30.055456', 'SECONDARY', 'ADMIN', 'SECONDARY', 'secondaryadmin@email.com', 'admin'),
(37, 'pbkdf2_sha256$1000000$UFC1nD18VKsqDURq6Uy5yR$SLaXuMKLI3XLEyEC/o2TXpZqosEUPCg+klqXZemOt7U=', '2025-06-08 07:20:40.456996', 0, 't1', 0, 1, '2025-06-08 06:34:58.558015', 'Dave', 'Sanchez', 'D', 't1@t1.com', 'teacher'),
(40, 'pbkdf2_sha256$1000000$0VKE4aAPHqvfoisM09XrAj$jZsIGNQApZWLPcp6ml1/nqB5Kk34awby8W3Y82D2Y80=', '2025-06-08 07:24:41.641295', 0, 't2', 0, 1, '2025-06-08 06:45:27.738217', 'Efren', 'Victorina', 'P', 't2@t2.com', 'teacher'),
(41, 'pbkdf2_sha256$1000000$gHCcFrfU4HkjmVfBxwAKz0$w4OZ7SZ8TdCZpqegx2xgXld6qnCjmqo/dEEn6HUlGdw=', '2025-06-08 07:22:47.375369', 0, 'jc', 0, 1, '2025-06-08 06:46:27.287231', 'JC', 'Alamos', 'A', 's2@s2.com', 'student'),
(42, 'pbkdf2_sha256$1000000$gSp09D78yrYntxIaTVtLCF$lLR9HZSS19/Gi6zDRS47EULI130JMbbJfkJBZYM7iSk=', NULL, 0, 'Angel', 0, 1, '2025-06-08 07:46:30.405522', 'Angel', 'Angeles', 'A', 's3@s3.com', 'student'),
(43, 'pbkdf2_sha256$1000000$eQcmHsWShU9AZFaPMmsT4Q$/F+SNMugLmkjSB4D0btZWvjS1o07eT70rmcBLs9nIm0=', '2025-06-08 07:53:23.895930', 0, 'Havannah', 0, 1, '2025-06-08 07:50:14.089011', 'Havannah', 'Havannah', 'Havannah', 'ha@ha.com', 'student'),
(44, 'pbkdf2_sha256$1000000$vqReUnTdnMFeYQaqHxfppp$4wER+7gcjh4/0h0yscM9IFMID/BNaofHdzxEPqX7F5k=', '2025-06-08 07:54:09.484894', 0, 'Earl', 0, 1, '2025-06-08 07:50:58.098655', 'Earl', 'Earl', 'Earl', 's4@s4.com', 'student'),
(45, 'pbkdf2_sha256$1000000$tRLpf8m26Qy1kMeV3zrVZH$XL7K48F5QmKQ7IIXQqonDIxyFiItfyK1N/j4aDycdUw=', '2025-06-08 08:10:45.250584', 0, 'newuser', 0, 1, '2025-06-08 08:10:36.528107', 'Sign Up Student', 'Sign Up Student', 'Sign Up Student', 'student@email.com', 'student');

-- --------------------------------------------------------

--
-- Table structure for table `api_user_groups`
--

CREATE TABLE `api_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_user_user_permissions`
--

CREATE TABLE `api_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_yearsection`
--

CREATE TABLE `api_yearsection` (
  `id` bigint(20) NOT NULL,
  `year` int(10) UNSIGNED NOT NULL CHECK (`year` >= 0),
  `section` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `api_yearsection`
--

INSERT INTO `api_yearsection` (`id`, `year`, `section`) VALUES
(14, 1, 'A'),
(13, 1, 'B'),
(17, 2, 'A'),
(18, 2, 'B');

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add content type', 4, 'add_contenttype'),
(14, 'Can change content type', 4, 'change_contenttype'),
(15, 'Can delete content type', 4, 'delete_contenttype'),
(16, 'Can view content type', 4, 'view_contenttype'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add course', 6, 'add_course'),
(22, 'Can change course', 6, 'change_course'),
(23, 'Can delete course', 6, 'delete_course'),
(24, 'Can view course', 6, 'view_course'),
(25, 'Can add quiz', 7, 'add_quiz'),
(26, 'Can change quiz', 7, 'change_quiz'),
(27, 'Can delete quiz', 7, 'delete_quiz'),
(28, 'Can view quiz', 7, 'view_quiz'),
(29, 'Can add user', 8, 'add_user'),
(30, 'Can change user', 8, 'change_user'),
(31, 'Can delete user', 8, 'delete_user'),
(32, 'Can view user', 8, 'view_user'),
(33, 'Can add quiz question', 9, 'add_quizquestion'),
(34, 'Can change quiz question', 9, 'change_quizquestion'),
(35, 'Can delete quiz question', 9, 'delete_quizquestion'),
(36, 'Can view quiz question', 9, 'view_quizquestion'),
(37, 'Can add quiz choice', 10, 'add_quizchoice'),
(38, 'Can change quiz choice', 10, 'change_quizchoice'),
(39, 'Can delete quiz choice', 10, 'delete_quizchoice'),
(40, 'Can view quiz choice', 10, 'view_quizchoice'),
(41, 'Can add quiz submission', 11, 'add_quizsubmission'),
(42, 'Can change quiz submission', 11, 'change_quizsubmission'),
(43, 'Can delete quiz submission', 11, 'delete_quizsubmission'),
(44, 'Can view quiz submission', 11, 'view_quizsubmission'),
(45, 'Can add quiz attempt', 12, 'add_quizattempt'),
(46, 'Can change quiz attempt', 12, 'change_quizattempt'),
(47, 'Can delete quiz attempt', 12, 'delete_quizattempt'),
(48, 'Can view quiz attempt', 12, 'view_quizattempt'),
(49, 'Can add subject', 13, 'add_subject'),
(50, 'Can change subject', 13, 'change_subject'),
(51, 'Can delete subject', 13, 'delete_subject'),
(52, 'Can view subject', 13, 'view_subject'),
(53, 'Can add year section', 14, 'add_yearsection'),
(54, 'Can change year section', 14, 'change_yearsection'),
(55, 'Can delete year section', 14, 'delete_yearsection'),
(56, 'Can view year section', 14, 'view_yearsection'),
(57, 'Can add student course year section', 15, 'add_studentcourseyearsection'),
(58, 'Can change student course year section', 15, 'change_studentcourseyearsection'),
(59, 'Can delete student course year section', 15, 'delete_studentcourseyearsection'),
(60, 'Can view student course year section', 15, 'view_studentcourseyearsection');

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(6, 'api', 'course'),
(7, 'api', 'quiz'),
(12, 'api', 'quizattempt'),
(10, 'api', 'quizchoice'),
(9, 'api', 'quizquestion'),
(11, 'api', 'quizsubmission'),
(15, 'api', 'studentcourseyearsection'),
(13, 'api', 'subject'),
(8, 'api', 'user'),
(14, 'api', 'yearsection'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'contenttypes', 'contenttype'),
(5, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-06-05 13:33:19.316927'),
(2, 'contenttypes', '0002_remove_content_type_name', '2025-06-05 13:33:19.400080'),
(3, 'auth', '0001_initial', '2025-06-05 13:33:19.662657'),
(4, 'auth', '0002_alter_permission_name_max_length', '2025-06-05 13:33:19.694855'),
(5, 'auth', '0003_alter_user_email_max_length', '2025-06-05 13:33:19.701811'),
(6, 'auth', '0004_alter_user_username_opts', '2025-06-05 13:33:19.708817'),
(7, 'auth', '0005_alter_user_last_login_null', '2025-06-05 13:33:19.716975'),
(8, 'auth', '0006_require_contenttypes_0002', '2025-06-05 13:33:19.720015'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2025-06-05 13:33:19.727006'),
(10, 'auth', '0008_alter_user_username_max_length', '2025-06-05 13:33:19.735006'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2025-06-05 13:33:19.742654'),
(12, 'auth', '0010_alter_group_name_max_length', '2025-06-05 13:33:19.774690'),
(13, 'auth', '0011_update_proxy_permissions', '2025-06-05 13:33:19.782692'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2025-06-05 13:33:19.789701'),
(15, 'api', '0001_initial', '2025-06-05 13:33:21.116820'),
(16, 'admin', '0001_initial', '2025-06-05 13:33:21.230465'),
(17, 'admin', '0002_logentry_remove_auto_add', '2025-06-05 13:33:21.242497'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2025-06-05 13:33:21.255480'),
(19, 'api', '0002_alter_quizsubmission_submitted_at', '2025-06-05 13:33:21.267063'),
(20, 'api', '0003_alter_quizsubmission_submitted_at', '2025-06-05 13:33:21.281033'),
(21, 'api', '0004_alter_quizsubmission_submitted_at', '2025-06-05 13:33:21.339783'),
(22, 'api', '0005_alter_quizquestion_question_type', '2025-06-05 13:33:21.346807'),
(23, 'api', '0006_alter_subject_unique_together_subject_course_and_more', '2025-06-05 13:33:21.698714'),
(24, 'sessions', '0001_initial', '2025-06-05 13:33:21.750957'),
(25, 'api', '0007_subject_year_section', '2025-06-06 08:30:25.703331'),
(26, 'api', '0008_remove_subject_year_section_subject_year', '2025-06-06 08:57:24.432269'),
(27, 'api', '0009_quizattempt_input_answer', '2025-06-07 17:58:17.341840'),
(28, 'api', '0010_alter_subject_unique_together', '2025-06-08 06:42:37.033293');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('12xjsbx9svddtin9s3467650mzp5966z', '.eJxVi0sKwzAMBe_idQmyI2G5y0LPYSTbwaYfSp2sSu-eBLJol29m3sdEWeYal17esWVzNhbN6ReqpFt57kZebThWH64PaffL4f4OVXrdak8OxmxpQudh1IwFOSgou0SArEE1EE4erAorsZPMmgL4slGXyXxXBY0xYw:1uO9f3:MawBX6rj8y1lqDacpvHbb-y_CBJuHa2L9-S2ueS1Pc8', '2025-06-22 06:37:41.851533'),
('1gi9ndxh05ysfutt4qqofiwh861pdvwi', '.eJxVi0sOwjAMBe-SNaqcpMYJSyTOETm1o0R8hEi7QtydVuoClm9m3tskXuaalq6v1MSczAjm8AszT1d9bIafbdhXHy53brfz7v4OlXtday9eS_YaLeWIgFICupWJDUBHVzDQiCSxEMdsOTsv6CACIZBqIfP5AiEiMXw:1uOAOX:JvhraFpdJSfkDBzcq_AWtXBRfqIjsEJ-WFAjlEfRdlE', '2025-06-22 07:24:41.645294'),
('1h1k4omy4tjr4x08vm2wbnxj82upm44u', '.eJxVi0sOwjAMBe-SNaqcpMYJSyTOETm1o0R8hEi7QtydVuoClm9m3tskXuaalq6v1MSczAjm8AszT1d9bIafbdhXHy53brfz7v4OlXtday9eS_YaLeWIgFICupWJDUBHVzDQiCSxEMdsOTsv6CACIZBqIfP5AiEiMXw:1uOAN5:L8CV11KDk1E4PR93OhbE5qYpNrukalQA1Qoko2nueSQ', '2025-06-22 07:23:11.033553'),
('1y7of9z2fs229jyy2oq1bzqdilbjya1r', '.eJxVi0sOAiEQBe_C2kzohkZwaeI5SANNIH5ixFkZ7z4zySx0-arqfVTk-d3iPOQVe1EnZUEdfmHifJXHZvjZp32N6XLnfjvv7u_QeLS1BmvEGRLyRSNWopShknGaAXQITtIxcK6avZUCPrM2vmydw-QBUX0XC6QxJg:1uOABK:X1VRQAvYlkKQuFAo_89TGzc9SCA9fD5NUu_EO24WzbI', '2025-06-22 07:11:02.508629'),
('2yfixrwafjynn1eavwrk6ghfmglp2b8e', '.eJxVy8sKwjAUBNB_yVpKe801qUvB7wj3FRJ8IKZdif9uC13U5cyZ-bhE81TS3Oydqrqz8-gO-5JJbvZchV6121Lrrg-q98tmf4dCrSxrjb0gj9EMwVA4wonUkAAIUHCBMETAnmkgyWrikYM_eshZx-DZfX9AwjKL:1uOB77:4INYeZS0DuGA7qA2rziSMAfdTbwtBGJxO8j7HZkzEG4', '2025-06-22 08:10:45.253584'),
('3ty1isx30lmzz83pwh1q80mrptr0gh8c', '.eJxVi8sKAjEMRf-laxnMNLaJS8HvKEmb0uIDsc5K_HcVZqHLc889T5dkebS0DLunXtzeAbrN76iST3b9Grn1aaUxHS_Sz4fV_QVNRvu8OUavQSBEqlAo0wysXhmtqGgBjJpDnJmxEiFkULYA1VvdZis7cq83INgyEg:1uO9by:VU9gJRNBWLgBtdce6wKsXoy0ko4uMadND3FqMGXdDuc', '2025-06-22 06:34:30.154857'),
('59boqmv36we5l6kkihzpp84hn9kgey7r', '.eJxVi0sOAiEQBe_C2kz4NNOMSxPPQR40BOInRpyV8e5qMgtd1qtXTxWxPlpcR7nHLmqviNTud0zIp3L9Gtz6tNGYjhf082Fzf0HDaJ83a2ccQ7SluiDA0uKJkjjW8KZyJSqSjUeWGTkAwsmbuVgddIGIer0BGUEyPg:1uOAr3:Wx3A22l9Iw_8zVWFzZoDAhowipOV7MFlwQDdxbTGPf0', '2025-06-22 07:54:09.488894'),
('5j6t0jvpybkljznfkvl7x1dd9dcwt3g3', '.eJxVi0sKAjEQBe_SaxmSTqdn2qXgOULnR4IfxDgr8e4qzEKX9erVE4KujxbWUe6hZ9iDJdj9jlHTqVy_Rm992mhMx4v282Fzf0HT0T5vntVWWVQisXgmKRmR2YmZXc6YEsWEzhATG4mo7KvLEX0VttYvHl5vBDgwtg:1uO8Zh:5DlmRp1bky3ncb9Fi4ko4hMNHz_vYqh1AF-PN3loVdU', '2025-06-22 05:28:05.912965'),
('5w2f3bfqs4h1bbrkegjrecc350ym3mum', '.eJxVi80KwyAQhN_FcwmrJmbtsdDnkF1XUfpDqcmp9N1rIIf0MszMN_NRgdalhLWld6iizsp6dTqWTPGWnhuhVx321Ibrg-r9srO_Q6FW-nqCyJwRtdGMDsiitzOYyQFrL8J5HtGNxuscpSumboxY8EkYE7D6_gAPjzGa:1uO9qa:YT1CiK8cOgBVDbDgfnNY4VRywwHmlKOnHjIZJ3P6VVY', '2025-06-22 06:49:36.266117'),
('6bj9xjyao8j7wikmht10o71hnepjm0gg', '.eJxVi0sOAiEQBe_C2kyAbhjGpYnnIA3dBOInRmZWxruLySx0-arqvVSkba1x6_KMjdVRwawOvzBRvsj9a-jRpn316Xyjdj3t7u9QqddRIzufTAZjE4uxgW1BRCDWIaBPxSwOqVhnMYOeQWBUOgsPK4s3oN4fGuMxXQ:1uO9cu:gD0o6xkSCze06RgtfTjr4WKd06537DgW8ApYi2nWOoY', '2025-06-22 06:35:28.869665'),
('aqhoe62oqhime52oaltepe794xlg2ayk', '.eJxVi80KwyAQhN_FcwmrJmbtsdDnkF1XUfpDqcmp9N1rIIf0MszMN_NRgdalhLWld6iizsp6dTqWTPGWnhuhVx321Ibrg-r9srO_Q6FW-nqCyJwRtdGMDsiitzOYyQFrL8J5HtGNxuscpSumboxY8EkYE7D6_gAPjzGa:1uOABo:yvnFs_UW-VNasCLhdt22pZfqB6bbBpnrYZSe9qE1Ceo', '2025-06-22 07:11:32.079627'),
('b75apl7s8ez41a8hhyr9iifv8ly4gp55', '.eJxVi0sKAjEQBe-StQwz6c6nXQqeI3Q6HRL8IMZZiXdXYRa6rFevnibx-mhpHXpPvZi9ATK73zGznPT6NXzr00ZjOl64nw-b-wsaj_Z559mL2IpEcbEAOGfkgCEKFaeOrARVRh8FSxYN1WsBUFeBeQlQ1bzeJhAybA:1uOAVI:ud1hCaDwlXlo50Jan8TqJlfX1qOjt2ZyvmA31AogWTA', '2025-06-22 07:31:40.676273'),
('c3qc4sftrsl9yar1psbxrmqvfoqtmnz6', '.eJxVi0sKwzAMBe_idQmyI2G5y0LPYSTbwaYfSp2sSu-eBLJol29m3sdEWeYal17esWVzNhbN6ReqpFt57kZebThWH64PaffL4f4OVXrdak8OxmxpQudh1IwFOSgou0SArEE1EE4erAorsZPMmgL4slGXyXxXBY0xYw:1uOAV8:jArepmxH1EfgwloWpCkfEYuBnMKB5AM2iUt_jpdUKaw', '2025-06-22 07:31:30.233924'),
('d00uzn37t8trjvz3xolx9l5y6ab0lmrf', '.eJxVi80KwyAQhN_FcwmrJmbtsdDnkF1XUfpDqcmp9N1rIIf0MszMN_NRgdalhLWld6iizsp6dTqWTPGWnhuhVx321Ibrg-r9srO_Q6FW-nqCyJwRtdGMDsiitzOYyQFrL8J5HtGNxuscpSumboxY8EkYE7D6_gAPjzGa:1uO9en:rRrRFRXE0LI6_OJ2OBWMrjMMZUEjxpxegC8R_lsbrHM', '2025-06-22 06:37:25.112794'),
('d2qygojs3jk3j5q7ocmhgezkfbv6kh9v', '.eJxVi0sOAiEQBe_C2kzohkZwaeI5SANNIH5ixFkZ7z4zySx0-arqfVTk-d3iPOQVe1EnZUEdfmHifJXHZvjZp32N6XLnfjvv7u_QeLS1BmvEGRLyRSNWopShknGaAXQITtIxcK6avZUCPrM2vmydw-QBUX0XC6QxJg:1uOAMh:z0-gbP7nqiB2nPbHIJ1QEL8OddjNXZviCLbs-lOiP5w', '2025-06-22 07:22:47.378368'),
('dnxb7ww7hhrx23xye4duw5dm4dez4akd', '.eJxVi0sOwjAMBe-SNaraYDuGJRLniGwnViI-QpSuEHcHpC5gOW_ePEOW5dHyMtd77iXsw5TC5ndUsVO9fo3c-rDSPBwv0s-H1f0FTeb2eSO4F6XRxl1hRwFFMCc244JslQSQEjBpiYTEPmn0mKQCeBXdhtcbRFcyng:1uNteF:0bnxmcIJzcKsk-k8tSouTvQXAAago-CLezF0KLXeUdc', '2025-06-21 13:31:47.217364'),
('ea9i9h8wlfsyrdkq6c8w3iuy0wdp5ii0', '.eJxVi0sOAiEQBe_C2kzohkZwaeI5SANNIH5ixFkZ7z4zySx0-arqfVTk-d3iPOQVe1EnZUEdfmHifJXHZvjZp32N6XLnfjvv7u_QeLS1BmvEGRLyRSNWopShknGaAXQITtIxcK6avZUCPrM2vmydw-QBUX0XC6QxJg:1uOAEr:DcuXv0ODisqvXW0WOxPOk1RviIFDxFC9n2QrBHQF2-U', '2025-06-22 07:14:41.761744'),
('gpgs2acswv26j9af85i8qhco1fmvtzi7', '.eJxVi0sKAjEQBe-StQxJJr92KXiO0N3pkOAHMc5KvPuMMAtd1qtXb5VxebW8DHnmXtRRGa0OvyMhX-T-Nfjo005jOt-wX0-7-wsajra9ASJVSVKtYR8MCKGTwugZLdlaOWgEmUGbmCpAcIWAIM5JEjpPrD4rUSYy0g:1uNB8G:LBZghTFTiozSEevzBZew0XFxZOrcct656zd_yBYLLAI', '2025-06-19 13:59:48.960271'),
('kph3xski19hchfocyzw2v2oztaf1ugqp', '.eJxVi0sOAiEQRO_C2kwaWmh0aeI5SDc0gfiJkZmV8e6OySx0V69e1cskXuaWlqHP1Is5GhvN7rcUzhe9fw0_-rTRmM437tfT5v4OjUdb12Sz1UOUEMV5lbomD6FgQAhEEETB-ehYBAtU1BL3iI4iZQdYic37AxTlMTc:1uNuCU:rCKqAqhVTZi_8zw4k1R7Jaj9po5GJ1pa8bfDB41mSVo', '2025-06-21 14:07:10.512675'),
('l40c94ao3z4q9fdw8pvw5v2g50w6ijew', '.eJxVi0sKAjEQBe_SaxmSTqdn2qXgOULnR4IfxDgr8e4qzEKX9erVE4KujxbWUe6hZ9iDJdj9jlHTqVy_Rm992mhMx4v282Fzf0HT0T5vntVWWVQisXgmKRmR2YmZXc6YEsWEzhATG4mo7KvLEX0VttYvHl5vBDgwtg:1uNtoV:GXb-qlXw7idDrsLSz7uZXJNqXPU_yJze0uUJ7BRed70', '2025-06-21 13:42:23.609927'),
('l6lels8hk7y4ra8bjfl91u6svltnjz68', '.eJxVi8sKAjEMRf-laxnMNLaJS8HvKEmb0uIDsc5K_HcVZqHLc889T5dkebS0DLunXtzeAbrN76iST3b9Grn1aaUxHS_Sz4fV_QVNRvu8OUavQSBEqlAo0wysXhmtqGgBjJpDnJmxEiFkULYA1VvdZis7cq83INgyEg:1uO9dP:0y3DQMW6RfKJHAdCcCeBozNsEiKeSw7RhLwBFXNR9f0', '2025-06-22 06:35:59.881570'),
('leouy7g7bq4skqdesgco2zh4ocizccla', '.eJxVi0sOAiEQBe_C2kyAbhjGpYnnIA3dBOInRmZWxruLySx0-arqvVSkba1x6_KMjdVRwawOvzBRvsj9a-jRpn316Xyjdj3t7u9QqddRIzufTAZjE4uxgW1BRCDWIaBPxSwOqVhnMYOeQWBUOgsPK4s3oN4fGuMxXQ:1uOAKe:i6Kkh1kIv5kAYTG87DxBBZ-UheprdR-x9osZwpm53jU', '2025-06-22 07:20:40.459996'),
('mdbup2cj0xd8vag0fj23g5zm3w5iomu7', '.eJxVi0sOwjAMBe-SNaqcpMYJSyTOETm1o0R8hEi7QtydVuoClm9m3tskXuaalq6v1MSczAjm8AszT1d9bIafbdhXHy53brfz7v4OlXtday9eS_YaLeWIgFICupWJDUBHVzDQiCSxEMdsOTsv6CACIZBqIfP5AiEiMXw:1uOALf:Yz3hoMo9BUcKVkuTlcKZIb7V2ZzVAGFWCwFBS6hPHaU', '2025-06-22 07:21:43.939302'),
('qyvy8m02yki0z9jocfhcw64jh8tawn1v', '.eJxVi0sOAiEQBe_C2kyARhpcmngO0g1NIH5iZGZlvLszySx0Wa9evVWiZW5pGfJKvaiTMkd1-B2Z8lUem6Fnn3Ya0-VO_Xbe3V_QaLT1nY21PgSsAh5YPHPUKFCYAzhXxRDaAFhqBEayhTxr1A5zJK8NaPX5AiWdMZE:1uO8b5:Hej5N0aSrFJ30d3Tp7LLtehkNxEGm-QcH3ZKiOAKoLk', '2025-06-22 05:29:31.470797'),
('t9o5ctg7d1axpmuifq5yngespqb31ta8', '.eJxVi0sKAjEQBe_SaxmSTqdn2qXgOULnR4IfxDgr8e4qzEKX9erVE4KujxbWUe6hZ9iDJdj9jlHTqVy_Rm992mhMx4v282Fzf0HT0T5vntVWWVQisXgmKRmR2YmZXc6YEsWEzhATG4mo7KvLEX0VttYvHl5vBDgwtg:1uNtq5:PPccy4XDLkbCeFOsOlabkA4TxbyZQ-aYpNMJn7M65ds', '2025-06-21 13:44:01.735552'),
('xp2nnu5laienzsank9be45xr12tjlda0', '.eJxVi0sKAjEQBe_SaxmSTqdn2qXgOULnR4IfxDgr8e4qzEKX9erVE4KujxbWUe6hZ9iDJdj9jlHTqVy_Rm992mhMx4v282Fzf0HT0T5vntVWWVQisXgmKRmR2YmZXc6YEsWEzhATG4mo7KvLEX0VttYvHl5vBDgwtg:1uNtnF:r-YhGsfcQSAw_b-Ed20o_hpdvfPiszl82PBhqMIbAi0', '2025-06-21 13:41:05.700470'),
('yj3cz0enzojjryq4bs6va502pdxhxera', '.eJxVi0sKwzAMBe_idQmyI2G5y0LPYSTbwaYfSp2sSu-eBLJol29m3sdEWeYal17esWVzNhbN6ReqpFt57kZebThWH64PaffL4f4OVXrdak8OxmxpQudh1IwFOSgou0SArEE1EE4erAorsZPMmgL4slGXyXxXBY0xYw:1uOAOk:guQIjLsu0ZukClJC6oKIo5hGrVQiq4Nsle0JOjrhhCM', '2025-06-22 07:24:54.200660'),
('yllywls7qrphl07cyoq9e18qagk4aiby', '.eJxVi0sKAjEQBe-StQwmadKJS8FzhE53hwQ_iJlZiXd3Bmahy3r16m0yLXPLy9BX7mJOBrw5_I6F-KqPzdCzTzuN6XKnfjvv7i9oNNr6llIta3AuWQlaj4ldYa8ETsgm8AjqY1TFgCrspFYgZEhRAT1SMZ8vTG4yyA:1uOAqJ:4ULbHvS4v5cKQI2Gf6t8_erdw_aC4N8eklb0KgjeUuc', '2025-06-22 07:53:23.898931'),
('ysuk237kgti202j2f7ouosrsc8tgb6wr', '.eJxVi0sKAjEQBe_Saxkmv07iUvAcoTvpkOAHMc5KvPuMMAtd1qtXb0i0vFpahjxTL3AEZeHwOzLli9y_hh592mlM5xv162l3f0Gj0ba316qioTkLsXhEVlpHydHlUCOZqqzFSOg5WF-ccaRYQjWzzlKYi8BnBS0iMog:1uO8n8:JNH3CTG2BF5e0vRea_dlB8Z3XEKRC7KZyqexj_QExHQ', '2025-06-22 05:41:58.572598'),
('zhbpfanzvgkxae70fvys68cpzong2a91', '.eJxVi0sOAiEQBe_C2kyARhpcmngO0g1NIH5iZGZlvLszySx0Wa9evVWiZW5pGfJKvaiTMkd1-B2Z8lUem6Fnn3Ya0-VO_Xbe3V_QaLT1nY21PgSsAh5YPHPUKFCYAzhXxRDaAFhqBEayhTxr1A5zJK8NaPX5AiWdMZE:1uO77H:frJlFsdhBNOLxuSbCHqKZukkSdohx2e2FLP5MZ5bSJU', '2025-06-22 03:54:39.653678'),
('zzwdu8jcz7mf3tsakfav0pvbdiq0lcx4', '.eJxVi0sKAjEQBe_SaxmSTqdn2qXgOULnR4IfxDgr8e4qzEKX9erVE4KujxbWUe6hZ9iDJdj9jlHTqVy_Rm992mhMx4v282Fzf0HT0T5vntVWWVQisXgmKRmR2YmZXc6YEsWEzhATG4mo7KvLEX0VttYvHl5vBDgwtg:1uO67F:s78ctUgCaGXU-dvAvVIyHUwWOBTpzCDxlDczaQqmHvk', '2025-06-22 02:50:33.624767');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_course`
--
ALTER TABLE `api_course`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `api_quiz`
--
ALTER TABLE `api_quiz`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`),
  ADD UNIQUE KEY `api_quiz_title_quiz_start_date_qu_02f1c162_uniq` (`title`,`quiz_start_date`,`quiz_end_date`,`subject_id`),
  ADD KEY `api_quiz_subject_id_fb3c375c_fk_api_subject_id` (`subject_id`);

--
-- Indexes for table `api_quizattempt`
--
ALTER TABLE `api_quizattempt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_quizattempt_quiz_id_4b081504_fk_api_quiz_id` (`quiz_id`),
  ADD KEY `api_quizattempt_student_id_8686c24b_fk_api_user_id` (`student_id`),
  ADD KEY `api_quizattempt_answer_id_861a7893_fk_api_quizchoice_id` (`answer_id`),
  ADD KEY `api_quizattempt_question_id_bd275f34_fk_api_quizquestion_id` (`question_id`),
  ADD KEY `api_quizattempt_submission_id_63537d53_fk_api_quizsubmission_id` (`submission_id`);

--
-- Indexes for table `api_quizchoice`
--
ALTER TABLE `api_quizchoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_quizchoice_question_id_choice_9152f9cd_uniq` (`question_id`,`choice`) USING HASH,
  ADD KEY `api_quizchoice_question_id_0a323c09_fk_api_quizquestion_id` (`question_id`);

--
-- Indexes for table `api_quizquestion`
--
ALTER TABLE `api_quizquestion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `question` (`question`) USING HASH,
  ADD KEY `api_quizquestion_quiz_id_84ca9fef_fk_api_quiz_id` (`quiz_id`);

--
-- Indexes for table `api_quizsubmission`
--
ALTER TABLE `api_quizsubmission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_quizsubmission_quiz_id_91d28d30_fk_api_quiz_id` (`quiz_id`),
  ADD KEY `api_quizsubmission_student_id_f302ebb4_fk_api_user_id` (`student_id`);

--
-- Indexes for table `api_studentcourseyearsection`
--
ALTER TABLE `api_studentcourseyearsection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_studentcourseyearsection_course_id_9216aa88_fk_api_course_id` (`course_id`),
  ADD KEY `api_studentcourseyearsection_student_id_98502cf1_fk_api_user_id` (`student_id`),
  ADD KEY `api_studentcourseyea_year_section_id_4f23ac2a_fk_api_years` (`year_section_id`);

--
-- Indexes for table `api_subject`
--
ALTER TABLE `api_subject`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subject_code` (`subject_code`),
  ADD UNIQUE KEY `api_subject_subject_code_teacher_id__54e5fe7f_uniq` (`subject_code`,`teacher_id`,`course_id`,`description`,`year`),
  ADD KEY `api_subject_teacher_id_bc148c99_fk_api_user_id` (`teacher_id`),
  ADD KEY `api_subject_course_id_9044de5a_fk_api_course_id` (`course_id`);

--
-- Indexes for table `api_user`
--
ALTER TABLE `api_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `api_user_groups`
--
ALTER TABLE `api_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_user_groups_user_id_group_id_9c7ddfb5_uniq` (`user_id`,`group_id`),
  ADD KEY `api_user_groups_group_id_3af85785_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `api_user_user_permissions`
--
ALTER TABLE `api_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_user_user_permissions_user_id_permission_id_a06dd704_uniq` (`user_id`,`permission_id`),
  ADD KEY `api_user_user_permis_permission_id_305b7fea_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `api_yearsection`
--
ALTER TABLE `api_yearsection`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_yearsection_year_section_90016f39_uniq` (`year`,`section`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_api_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_course`
--
ALTER TABLE `api_course`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `api_quiz`
--
ALTER TABLE `api_quiz`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `api_quizattempt`
--
ALTER TABLE `api_quizattempt`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `api_quizchoice`
--
ALTER TABLE `api_quizchoice`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=222;

--
-- AUTO_INCREMENT for table `api_quizquestion`
--
ALTER TABLE `api_quizquestion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `api_quizsubmission`
--
ALTER TABLE `api_quizsubmission`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `api_studentcourseyearsection`
--
ALTER TABLE `api_studentcourseyearsection`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `api_subject`
--
ALTER TABLE `api_subject`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `api_user`
--
ALTER TABLE `api_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `api_user_groups`
--
ALTER TABLE `api_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_user_user_permissions`
--
ALTER TABLE `api_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `api_yearsection`
--
ALTER TABLE `api_yearsection`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_quiz`
--
ALTER TABLE `api_quiz`
  ADD CONSTRAINT `api_quiz_subject_id_fb3c375c_fk_api_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `api_subject` (`id`);

--
-- Constraints for table `api_quizattempt`
--
ALTER TABLE `api_quizattempt`
  ADD CONSTRAINT `api_quizattempt_answer_id_861a7893_fk_api_quizchoice_id` FOREIGN KEY (`answer_id`) REFERENCES `api_quizchoice` (`id`),
  ADD CONSTRAINT `api_quizattempt_question_id_bd275f34_fk_api_quizquestion_id` FOREIGN KEY (`question_id`) REFERENCES `api_quizquestion` (`id`),
  ADD CONSTRAINT `api_quizattempt_quiz_id_4b081504_fk_api_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `api_quiz` (`id`),
  ADD CONSTRAINT `api_quizattempt_student_id_8686c24b_fk_api_user_id` FOREIGN KEY (`student_id`) REFERENCES `api_user` (`id`),
  ADD CONSTRAINT `api_quizattempt_submission_id_63537d53_fk_api_quizsubmission_id` FOREIGN KEY (`submission_id`) REFERENCES `api_quizsubmission` (`id`);

--
-- Constraints for table `api_quizchoice`
--
ALTER TABLE `api_quizchoice`
  ADD CONSTRAINT `api_quizchoice_question_id_0a323c09_fk_api_quizquestion_id` FOREIGN KEY (`question_id`) REFERENCES `api_quizquestion` (`id`);

--
-- Constraints for table `api_quizquestion`
--
ALTER TABLE `api_quizquestion`
  ADD CONSTRAINT `api_quizquestion_quiz_id_84ca9fef_fk_api_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `api_quiz` (`id`);

--
-- Constraints for table `api_quizsubmission`
--
ALTER TABLE `api_quizsubmission`
  ADD CONSTRAINT `api_quizsubmission_quiz_id_91d28d30_fk_api_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `api_quiz` (`id`),
  ADD CONSTRAINT `api_quizsubmission_student_id_f302ebb4_fk_api_user_id` FOREIGN KEY (`student_id`) REFERENCES `api_user` (`id`);

--
-- Constraints for table `api_studentcourseyearsection`
--
ALTER TABLE `api_studentcourseyearsection`
  ADD CONSTRAINT `api_studentcourseyea_year_section_id_4f23ac2a_fk_api_years` FOREIGN KEY (`year_section_id`) REFERENCES `api_yearsection` (`id`),
  ADD CONSTRAINT `api_studentcourseyearsection_course_id_9216aa88_fk_api_course_id` FOREIGN KEY (`course_id`) REFERENCES `api_course` (`id`),
  ADD CONSTRAINT `api_studentcourseyearsection_student_id_98502cf1_fk_api_user_id` FOREIGN KEY (`student_id`) REFERENCES `api_user` (`id`);

--
-- Constraints for table `api_subject`
--
ALTER TABLE `api_subject`
  ADD CONSTRAINT `api_subject_course_id_9044de5a_fk_api_course_id` FOREIGN KEY (`course_id`) REFERENCES `api_course` (`id`),
  ADD CONSTRAINT `api_subject_teacher_id_bc148c99_fk_api_user_id` FOREIGN KEY (`teacher_id`) REFERENCES `api_user` (`id`);

--
-- Constraints for table `api_user_groups`
--
ALTER TABLE `api_user_groups`
  ADD CONSTRAINT `api_user_groups_group_id_3af85785_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `api_user_groups_user_id_a5ff39fa_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`);

--
-- Constraints for table `api_user_user_permissions`
--
ALTER TABLE `api_user_user_permissions`
  ADD CONSTRAINT `api_user_user_permis_permission_id_305b7fea_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `api_user_user_permissions_user_id_f3945d65_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`);

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_api_user_id` FOREIGN KEY (`user_id`) REFERENCES `api_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
