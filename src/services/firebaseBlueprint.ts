/**
 * Firebase Firestore Blueprint & Architecture Specification
 * 
 * This file and firebase-blueprint.json outline the production schema,
 * security rules, and adapter interface designed to plug directly into
 * Google Cloud Firestore when live cloud persistence is provisioned.
 */

export interface FirestoreBlueprintSchema {
  version: string;
  projectName: string;
  collections: {
    branches: {
      documentId: 'branchId';
      fields: {
        id: string;
        name: string;
        code: string;
        address: string;
        operatingHours: string;
        activeTellers: number;
        activeConsultants: number;
        status: string;
        updatedAt: string;
      };
    };
    departments: {
      documentId: 'deptId';
      fields: {
        id: string;
        name: string;
        codePrefix: string;
        category: string;
        avgServiceMinutes: number;
        assignedCounters: string;
        activeQueueCount: number;
        nextTicketSeq: number;
      };
    };
    tickets: {
      documentId: 'ticketId';
      fields: {
        id: string;
        ticketNumber: string;
        branchId: string;
        departmentId: string;
        departmentName: string;
        serviceId: string;
        serviceName: string;
        customerName?: string;
        phone?: string;
        requestNotes?: string;
        priority: 'standard' | 'senior' | 'accessibility' | 'premier';
        status: 'waiting' | 'called' | 'in-service' | 'completed' | 'cancelled';
        assignedCounter: string;
        queuePosition: number;
        estimatedWaitMinutes: number;
        createdAt: string; // Firestore Timestamp
        calledAt?: string;
        completedAt?: string;
      };
      indexes: Array<{
        fields: Array<{ fieldPath: string; order: 'ASCENDING' | 'DESCENDING' }>;
      }>;
    };
    counters: {
      documentId: 'counterId';
      fields: {
        counterNumber: string;
        counterType: 'Teller' | 'Consultant Desk' | 'Private Room';
        staffName: string;
        currentTicketNumber?: string;
        status: 'Available' | 'Busy' | 'Break';
        departmentIds: string[];
      };
    };
  };
}

export const FIRESTORE_BLUEPRINT: FirestoreBlueprintSchema = {
  version: '1.0.0',
  projectName: 'SmartBank Queue',
  collections: {
    branches: {
      documentId: 'branchId',
      fields: {
        id: 'string',
        name: 'string',
        code: 'string',
        address: 'string',
        operatingHours: 'string',
        activeTellers: 6,
        activeConsultants: 9,
        status: 'Open',
        updatedAt: 'timestamp'
      }
    },
    departments: {
      documentId: 'deptId',
      fields: {
        id: 'string',
        name: 'string',
        codePrefix: 'string',
        category: 'string',
        avgServiceMinutes: 5,
        assignedCounters: 'string',
        activeQueueCount: 0,
        nextTicketSeq: 100
      }
    },
    tickets: {
      documentId: 'ticketId',
      fields: {
        id: 'string',
        ticketNumber: 'string',
        branchId: 'string',
        departmentId: 'string',
        departmentName: 'string',
        serviceId: 'string',
        serviceName: 'string',
        priority: 'standard',
        status: 'waiting',
        assignedCounter: 'string',
        queuePosition: 1,
        estimatedWaitMinutes: 5,
        createdAt: 'timestamp'
      },
      indexes: [
        {
          fields: [
            { fieldPath: 'branchId', order: 'ASCENDING' },
            { fieldPath: 'departmentId', order: 'ASCENDING' },
            { fieldPath: 'status', order: 'ASCENDING' },
            { fieldPath: 'createdAt', order: 'ASCENDING' }
          ]
        }
      ]
    },
    counters: {
      documentId: 'counterId',
      fields: {
        counterNumber: 'string',
        counterType: 'Teller',
        staffName: 'string',
        status: 'Available',
        departmentIds: ['cash-deposits', 'cash-withdrawals']
      }
    }
  }
};
