const express = require('express');
const neo4j = require('neo4j-driver');
const app = express();

app.use(express.json());

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '20SAIF02')
);

const session = driver.session();



// Create a new user profile
app.post('/api/user-profile', async (req, res) => {
  const { name, skills, experience, interests, education } = req.body;
  try {
    const result = await session.run(
        'CREATE (p:ProfilUtilisateur {name: $name, skills: $skills, experience: $experience, interests: $interests, education: $education}) RETURN ID(p) as id, p',
        { name, skills, experience, interests, education }
    );
    const profile = {
      id: result.records[0].get('id'),
      properties: result.records[0].get('p').properties
    };
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all user profiles
app.get('/api/user-profiles', async (req, res) => {
  try {
    const result = await session.run('MATCH (p:ProfilUtilisateur) RETURN ID(p) as id, p');
    const profiles = result.records.map(record => ({
      id: record.get('id'),
      properties: record.get('p').properties
    }));
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user profile
app.put('/api/user-profile/:id', async (req, res) => {
  const id = req.params.id;
  const { name, skills, experience, interests, education } = req.body;
  try {
    const result = await session.run(
        'MATCH (p:ProfilUtilisateur) WHERE ID(p) = toInteger($id) SET p += {name: $name, skills: $skills, experience: $experience, interests: $interests, education: $education} RETURN ID(p) as id, p',
        { id, name, skills, experience, interests, education }
    );
    const profile = {
      id: result.records[0].get('id'),
      properties: result.records[0].get('p').properties
    };
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user profile
app.delete('/api/user-profile/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await session.run(
        'MATCH (p:ProfilUtilisateur) WHERE ID(p) = toInteger($id) DETACH DELETE p',
        { id }
    );
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new job offer
app.post('/api/job-offer', async (req, res) => {
  const { title, description, requiredSkills, responsibilities } = req.body;
  try {
    const result = await session.run(
        'CREATE (o:OffreEmploi {title: $title, description: $description, requiredSkills: $requiredSkills, responsibilities: $responsibilities}) RETURN ID(o) as id, o',
        { title, description, requiredSkills, responsibilities }
    );
    const offer = {
      id: result.records[0].get('id'),
      properties: result.records[0].get('o').properties
    };
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all job offers
app.get('/api/job-offers', async (req, res) => {
  try {
    const result = await session.run('MATCH (o:OffreEmploi) RETURN ID(o) as id, o');
    const offers = result.records.map(record => ({
      id: record.get('id'),
      properties: record.get('o').properties
    }));
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a job offer
app.put('/api/job-offer/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description, requiredSkills, responsibilities } = req.body;
  try {
    const result = await session.run(
        'MATCH (o:OffreEmploi) WHERE ID(o) = toInteger($id) SET o += {title: $title, description: $description, requiredSkills: $requiredSkills, responsibilities: $responsibilities} RETURN ID(o) as id, o',
        { id, title, description, requiredSkills, responsibilities }
    );
    const offer = {
      id: result.records[0].get('id'),
      properties: result.records[0].get('o').properties
    };
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a job offer
app.delete('/api/job-offer/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await session.run(
        'MATCH (o:OffreEmploi) WHERE ID(o) = toInteger($id) DETACH DELETE o',
        { id }
    );
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new skill
app.post('/api/skill', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await session.run(
        'CREATE (c:Competence {name: $name}) RETURN ID(c) as id, c',
        { name }
    );
    const skill = {
      id: result.records[0].get('id'),
      properties: result.records[0].get('c').properties
    };
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all skills
app.get('/api/skills', async (req, res) => {
  try {
    const result = await session.run('MATCH (c:Competence) RETURN ID(c) as id, c');
    const skills = result.records.map(record => ({
      id: record.get('id'),
      properties: record.get('c').properties
    }));
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a skill
app.put('/api/skill/:id', async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const result = await session.run(
        'MATCH (c:Competence) WHERE ID(c) = toInteger($id) SET c.name = $name RETURN ID(c) as id, c',
        { id, name }
    );
    const skill = {
      id: result.records[0].get('id'),
      properties: result.records[0].get('c').properties
    };
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a skill
app.delete('/api/skill/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await session.run(
        'MATCH (c:Competence) WHERE ID(c) = toInteger($id) DETACH DELETE c',
        { id }
    );
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a skill to a user profile
app.post('/api/user-profile/:userId/skill/:skillId', async (req, res) => {
  const userId = req.params.userId;
  const skillId = req.params.skillId;
  try {
    await session.run(
        'MATCH (p:ProfilUtilisateur), (c:Competence) WHERE ID(p) = toInteger($userId) AND ID(c) = toInteger($skillId) CREATE (p)-[:A_COMPETENCE]->(c)',
        { userId, skillId }
    );
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a skill from a user profile
app.delete('/api/user-profile/:userId/skill/:skillId', async (req, res) => {
  const userId = req.params.userId;
  const skillId = req.params.skillId;
  try {
    await session.run(
        'MATCH (p:ProfilUtilisateur)-[r:A_COMPETENCE]->(c:Competence) WHERE ID(p) = toInteger($userId) AND ID(c) = toInteger($skillId) DELETE r',
        { userId, skillId }
    );
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a required skill to a job offer
app.post('/api/job-offer/:offerId/skill/:skillId', async (req, res) => {
  const offerId = req.params.offerId;
  const skillId = req.params.skillId;
  try {
    await session.run(
        'MATCH (o:OffreEmploi), (c:Competence) WHERE ID(o) = toInteger($offerId) AND ID(c) = toInteger($skillId) CREATE (o)-[:REQUIERT]->(c)',
        { offerId, skillId }
    );
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a required skill from a job offer
app.delete('/api/job-offer/:offerId/skill/:skillId', async (req, res) => {
  const offerId = req.params.offerId;
  const skillId = req.params.skillId;
  try {
    await session.run(
        'MATCH (o:OffreEmploi)-[r:REQUIERT]->(c:Competence) WHERE ID(o) = toInteger($offerId) AND ID(c) = toInteger($skillId) DELETE r',
        { offerId, skillId }
    );
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a user profile to a job offer as an applicant
app.post('/api/job-offer/:offerId/applicant/:userId', async (req, res) => {
  const offerId = req.params.offerId;
  const userId = req.params.userId;
  try {
    await session.run(
        'MATCH (o:OffreEmploi), (p:ProfilUtilisateur) WHERE ID(o) = toInteger($offerId) AND ID(p) = toInteger($userId) CREATE (p)-[:CANDIDATE]->(o)',
        { offerId, userId }
    );
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a user profile from a job offer as an applicant
app.delete('/api/job-offer/:offerId/applicant/:userId', async (req, res) => {
  const offerId = req.params.offerId;
  const userId = req.params.userId;
  try {
    await session.run(
        'MATCH (p:ProfilUtilisateur)-[r:CANDIDATE]->(o:OffreEmploi) WHERE ID(o) = toInteger($offerId) AND ID(p) = toInteger($userId) DELETE r',
        { offerId, userId }
    );
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a job offer by ID
app.get('/api/job-offer/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await session.run(
        'MATCH (o:OffreEmploi) WHERE ID(o) = toInteger($id) RETURN o',
        { id }
    );
    if (result.records.length === 0) {
      res.status(404).json({ error: 'Job offer not found' });
      return;
    }
    const jobOffer = {
      id: result.records[0].get('o').identity.low,
      properties: result.records[0].get('o').properties
    };
    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user profile by ID
app.get('/api/user-profile/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await session.run(
        'MATCH (p:ProfilUtilisateur) WHERE ID(p) = toInteger($id) RETURN p',
        { id }
    );
    if (result.records.length === 0) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }
    const userProfile = {
      id: result.records[0].get('p').identity.low,
      properties: result.records[0].get('p').properties
    };
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a skill by ID
app.get('/api/skill/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await session.run(
        'MATCH (c:Competence) WHERE ID(c) = toInteger($id) RETURN c',
        { id }
    );
    if (result.records.length === 0) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }
    const skill = {
      id: result.records[0].get('c').identity.low,
      properties: result.records[0].get('c').properties
    };
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});








app.listen(3100, () => {
  console.log('Server is running on port 3100');
});

module.exports = app;
