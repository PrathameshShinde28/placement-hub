import User from '../models/User.js';

// Get Skill Gap Analysis
export const getSkillGap = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const userCurrentSkills = user.skills || [];

    // Define required skills for different roles
    const roleRequiredSkills = {
      'Software Engineer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'System Design', 'Data Structures', 'Algorithms'],
      'Frontend Developer': ['JavaScript', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'TypeScript', 'Redux'],
      'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'System Design', 'Database Design', 'SQL'],
      'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS', 'System Design'],
      'Data Scientist': ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'SQL', 'Statistics'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Jenkins', 'Terraform'],
    };

    const requiredSkills = roleRequiredSkills[user.targetRole] || roleRequiredSkills['Software Engineer'];
    
    // Convert current skills to lowercase for case-insensitive comparison
    const userCurrentSkillsLower = userCurrentSkills.map(s => s.toLowerCase());
    
    // Calculate missing skills - skills that are required but not yet learned (case-insensitive)
    const missingSkills = requiredSkills.filter(skill => !userCurrentSkillsLower.includes(skill.toLowerCase()));
    
    // Calculate proficiency gap for each skill (case-insensitive)
    const proficiencyGap = {};
    requiredSkills.forEach(skill => {
      if (userCurrentSkillsLower.includes(skill.toLowerCase())) {
        proficiencyGap[skill] = 80; // User has skill - 80% proficiency
      } else {
        proficiencyGap[skill] = 0; // Missing skill - 0% proficiency
      }
    });

    // Map courses to skills (example mapping)
    const skillToCourses = {
      'Node.js': { name: 'Node.js Masterclass', provider: 'Udemy', duration: '40 hours' },
      'MongoDB': { name: 'MongoDB University', provider: 'MongoDB', duration: '30 hours' },
      'React': { name: 'React Complete Course', provider: 'Udemy', duration: '35 hours' },
      'TypeScript': { name: 'TypeScript Advanced', provider: 'Coursera', duration: '25 hours' },
      'System Design': { name: 'System Design Interview', provider: 'Educative', duration: '45 hours' },
      'Python': { name: 'Python for Data Science', provider: 'Coursera', duration: '40 hours' },
      'Docker': { name: 'Docker Mastery', provider: 'Udemy', duration: '30 hours' },
      'AWS': { name: 'AWS Solutions Architect', provider: 'A Cloud Guru', duration: '50 hours' },
    };

    // Get recommended courses for missing skills
    const recommendedCourses = missingSkills
      .slice(0, 3) // Top 3 missing skills
      .map(skill => skillToCourses[skill] || { 
        name: `${skill} Mastery`, 
        provider: 'Online Platform', 
        duration: '30-40 hours' 
      });

    const skillGapData = {
      currentSkills: userCurrentSkills,
      targetRole: user.targetRole,
      requiredSkills: requiredSkills,
      missingSkills: missingSkills,
      proficiencyGap: proficiencyGap,
      recommendedCourses: recommendedCourses.length > 0 ? recommendedCourses : [
        { name: 'Advanced Web Development', provider: 'Coursera', duration: '40 hours' },
      ],
      timeline: missingSkills.length > 3 ? '6 months' : '3 months',
      progressPercentage: Math.round((userCurrentSkills.length / requiredSkills.length) * 100),
    };

    res.status(200).json({
      success: true,
      data: skillGapData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Skill
export const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    const user = await User.findById(req.userId);
    
    // Check if skill already exists (case-insensitive)
    const skillExists = user.skills.some(s => s.toLowerCase() === skill.toLowerCase());
    
    if (!skillExists) {
      // Store with proper casing (capitalize first letter)
      const normalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
      user.skills.push(normalizedSkill);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Skill added successfully',
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Skill
export const removeSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    const user = await User.findById(req.userId);
    // Remove skill case-insensitively
    user.skills = user.skills.filter((s) => s.toLowerCase() !== skill.toLowerCase());
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
