import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects API
  
  // Get all projects for a user
  app.get("/api/projects", async (req, res) => {
    // For demo purposes, use userId 1
    const userId = 1;
    const projects = await storage.getProjects(userId);
    res.json(projects);
  });
  
  // Get a single project
  app.get("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  });
  
  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      // For demo purposes, use userId 1
      const userId = 1;
      
      const parsedBody = insertProjectSchema.parse({
        ...req.body,
        userId
      });
      
      const project = await storage.createProject(parsedBody);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  
  // Update a project
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const { content, lastModified } = req.body;
      if (!content || !lastModified) {
        return res.status(400).json({ message: "Content and lastModified are required" });
      }
      
      const project = await storage.updateProject(id, content, lastModified);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  
  // Delete a project
  app.delete("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const success = await storage.deleteProject(id);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(204).end();
  });

  const httpServer = createServer(app);

  return httpServer;
}
