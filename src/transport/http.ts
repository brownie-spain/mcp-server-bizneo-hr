import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import cors from 'cors';
import express from 'express';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import type { BizneoHRApi } from '../api/index.js';
import { createMcpServer } from '../mcp/server.js';
import { config } from '../config/index.js';

interface SessionEntry {
  transport: StreamableHTTPServerTransport;
  createdAt: Date;
}

export async function startHttpServer(
  api: BizneoHRApi,
  port: number = config.MCP_PORT,
  host: string = config.MCP_HOST,
): Promise<void> {
  const app = createMcpExpressApp({ host });

  // CORS — allow AI agents / OpenAI to call cross-origin
  const corsOrigins =
    config.MCP_CORS_ORIGINS === '*' ? '*' : config.MCP_CORS_ORIGINS.split(',').map((o) => o.trim());

  app.use(
    cors({
      origin: corsOrigins,
      allowedHeaders: ['Content-Type', 'Mcp-Session-Id', 'Authorization', 'Accept'],
      exposedHeaders: ['Mcp-Session-Id'],
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    }),
  );

  app.use(express.json());

  // Active sessions: sessionId → transport
  const sessions = new Map<string, SessionEntry>();

  async function handleMcp(req: Request, res: Response): Promise<void> {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    // Resume existing session
    if (sessionId) {
      const entry = sessions.get(sessionId);
      if (!entry) {
        res.status(404).json({ error: 'Session not found', sessionId });
        return;
      }
      await entry.transport.handleRequest(req, res, req.body);
      return;
    }

    // Only POST with an InitializeRequest can open a new session
    if (req.method !== 'POST' || !isInitializeRequest(req.body)) {
      res.status(400).json({
        error: 'Bad Request: new connections must send an InitializeRequest via POST',
      });
      return;
    }

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (id) => {
        sessions.set(id, { transport, createdAt: new Date() });
      },
      onsessionclosed: (id) => {
        sessions.delete(id);
      },
    });

    transport.onclose = () => {
      if (transport.sessionId) {
        sessions.delete(transport.sessionId);
      }
    };

    const server = createMcpServer(api);
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }

  app.post('/mcp', handleMcp);
  app.get('/mcp', handleMcp);
  app.delete('/mcp', handleMcp);

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      transport: 'http',
      activeSessions: sessions.size,
      uptime: process.uptime(),
    });
  });

  await new Promise<void>((resolve) => {
    app.listen(port, host, () => {
      process.stderr.write(
        `Bizneo HR MCP Server (HTTP/Streamable) ready at http://${host}:${port}/mcp\n`,
      );
      resolve();
    });
  });
}
