## 🚀 Agent Rules for HR Management System Development

This document defines the rules for all agents working on the HR Management System. All agents must strictly adhere to these guidelines.

---

### 1. 📚 Core Documentation Reference

All agents must use these documents as their primary source of truth:

- [AGENTS.md](%7Bfile:///Users/gracethompson/Documents/femis-stuff/web-devpt/hr-mgmt/hr-mgmt-frontend/AGENTS.md%7D): Global agent guidelines and communication protocols
- [AGENT_SYSTEM_PROMPT_README.md](%7Bfile:///Users/gracethompson/Documents/femis-stuff/web-devpt/hr-mgmt/hr-mgmt-backend/AGENT_SYSTEM_PROMPT_README.md%7D): Backend AI Agent System Instructions
- [TASK_WORKFLOW_README.md](%7Bfile:///Users/gracethompson/Documents/femis-stuff/web-devpt/hr-mgmt/hr-mgmt-backend/TASK_WORKFLOW_README.md%7D): Task assignment and workflow management
- [Task Execution Protocol - HRMS.md](%7Bfile:///Users/gracethompson/Documents/femis-stuff/web-devpt/hr-mgmt/hr-mgmt-backend/Task%20Execution%20Protocol%20-%20HRMS.md%7D): Step-by-step task execution workflow
- [PROJECT_STANDARDS.md](%7Bfile:///Users/gracethompson/Documents/femis-stuff/web-devpt/hr-mgmt/hr-mgmt-backend/PROJECT_STANDARDS.md%7D): Coding standards and project structure
- [TECHNOLOGY_STACK_README.md](%7Bfile:///Users/gracethompson/Documents/femis-stuff/web-devpt/hr-mgmt/hr-mgmt-backend/TECHNOLOGY_STACK_README.md%7D): Technology stack and architecture decisions

---

### 2. 🔄 Project Workflow Protocol

All task execution must follow this workflow:

#### Phase 1: Task Analysis

1. **Analyze task requirements** from Trello tickets
2. **Check project documentation** for standards and architecture decisions
3. **Break down into implementation steps** (at least 5 steps)
4. **Create Task Execution Document** with detailed plan

#### Phase 2: Development

1. **Create feature branch** with descriptive name
2. **Implement functionality** following project standards
3. **Write unit tests** (at least 3 tests per feature)
4. **Test locally** to ensure no regressions

#### Phase 3: Code Review

1. **Create Pull Request** with clear description
2. **Request review** from appropriate senior agents
3. **Respond to feedback** and make necessary revisions
4. **Get approval** from at least 2 senior agents

#### Phase 4: Deployment

1. **Update project documentation** with changes
2. **Merge to main branch** after successful review
3. **Monitor deployment** for any issues
4. **Close Trello ticket** with summary of work

---

### 3. 🎯 Implementation Guidelines

#### Coding Standards

- Use TypeScript with strict type checking
- Follow functional programming principles
- Implement proper error handling with custom exceptions
- Use Prisma for database operations (not raw SQL)
- Implement proper authentication and authorization
- Follow the project architecture as defined in TECHNOLOGY_STACK_README.md

#### Testing Requirements

- All new features must include unit tests
- Aim for at least 80% test coverage
- Use Jest for testing framework
- Write meaningful test descriptions
- Test edge cases and error scenarios

#### Documentation Requirements

- Update API documentation after implementing new endpoints
- Document breaking changes in CHANGELOG.md
- Keep project README updated with latest information
- Document any new architecture decisions inARCHITECTURE_DECISIONS.md

---

### 4. 🗣️ Communication Protocols

#### Daily Communication

- Start each day with a project status update
- Use project management tools (Trello, GitHub)
- Keep communication clear and concise
- Use proper code formatting in all messages

#### Code Review Communication

- Be specific with feedback (don't just say "this is wrong")
- Provide actionable suggestions for improvement
- Be respectful and constructive
- Avoid nitpicking on minor style preferences

#### Escalation Protocol

When to escalate an issue:

1. Task blocked for more than 4 hours
2. Encountering architectural decisions not covered in documentation
3. Multiple agents are blocked by the same issue
4. Need access to resources not currently available

Escalation format:

```
URGENT: [Brief description of issue]

Context: [Relevant background information]

Steps already taken: [What you've tried]

Impact: [Why this is blocking progress]

Requested action: [What you need]
```

---

### 5. 🛠️ Technology Stack Guidelines

#### Frontend

- React with TypeScript
- Tailwind CSS for styling
- TanStack Router for routing
- TanStack Query for data fetching
- Shadcn/UI components

#### Backend

- Node.js with TypeScript
- Express.js for API framework
- Prisma for database ORM
- JWT for authentication
- bcryptjs for password hashing

#### Database

- PostgreSQL
- Managed through AWS RDS
- Migrations managed via Prisma

---

### 6. ⚠️ Common Pitfalls to Avoid

#### Pitfall 1: Bypassing Documentation

❌ **Never** implement functionality without checking project documentation first
✅ **Always** review relevant documentation before starting implementation

#### Pitfall 2: Skipping Tests

❌ **Never** submit code without unit tests
✅ **Always** write tests for new features and bug fixes

#### Pitfall 3: Poor Error Handling

❌ **Never** use generic error handlers or return raw error objects
✅ **Always** use custom exceptions defined in the error handling module

#### Pitfall 4: Breaking Architecture

❌ **Never** deviate from the defined architecture
✅ **Always** follow the technology stack and architectural patterns

#### Pitfall 5: Incomplete Code Reviews

❌ **Never** approve PRs without thorough review
✅ **Always** provide specific, actionable feedback

---

### 7. 🔄 Daily Task Execution Flow

**Morning Routine (First 30 minutes):**

1. [ ] Review Trello board for new/updated tasks
2. [ ] Check project documentation for relevant updates
3. [ ] Prioritize tasks based on project goals
4. [ ] Create Task Execution Documents for top priority tasks

**Development Block (Next 3-4 hours):**

1. [ ] Implement assigned tasks following the Task Execution Protocol
2. [ ] Create unit tests for all new functionality
3. [ ] Test code locally to ensure quality
4. [ ] Document any issues encountered

**Code Review Block (Next 1-2 hours):**

1. [ ] Review Pull Requests from other agents
2. [ ] Provide constructive feedback
3. [ ] Help resolve any issues blocking progress

**Wrap-up (Last 30 minutes):**

1. [ ] Update project documentation
2. [ ] Commit any work-in-progress changes
3. [ ] Plan tasks for the next day
4. [ ] Update Trello board status

---

### 8. ✅ Agent Compliance Checklist

Before starting any task, verify you have:

- [ ] Read and understood the task requirements
- [ ] Reviewed relevant project documentation
- [ ] Created a Task Execution Document
- [ ] Allocated time for testing
- [ ] Allocated time for documentation
- [ ] Understood the project standards

Before completing a task, verify:

- [ ] All functionality is implemented correctly
- [ ] Unit tests are written and passing
- [ ] Documentation is updated
- [ ] Code has been reviewed
- [ ] No breaking changes without proper documentation
- [ ] All Trello ticket criteria are met

---

### 9. 📚 Quick Reference: Key Documentation Locations

| Document | Purpose |
| -------- | ------- |

| [AGENTS.md](%7Bfile:///Users/gracethompson/Documents/femis-stuff/web-devpt/hr-mgmt/hr-mgmt-
