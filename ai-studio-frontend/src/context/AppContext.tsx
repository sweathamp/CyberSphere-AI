import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  Investigation,
  SecurityFile,
  ChatMessage,
  UserProfile,
  AgentType,
  PipelineStage,
} from '../types';

import { classifyInput } from '../utils/inputClassifier';


interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;

  investigations: Investigation[];
  currentInvestigationId: string | null;
  currentInvestigation: Investigation | null;

  files: SecurityFile[];

  isAnalyzing: boolean;
  pipelineStages: PipelineStage[];
  activeAgent: AgentType;

  login: (email: string, pass: string) => void;
  logout: () => void;

  setCurrentInvestigationId: (id: string | null) => void;

  createNewInvestigation: (
    title?: string,
    initialPrompt?: string,
    category?: any
  ) => string;

  sendMessage: (
    text: string,
    attachedFile?: SecurityFile | null
  ) => Promise<ChatMessage | null>;

  addFile: (
    file: Omit<SecurityFile, 'id'>
  ) => SecurityFile;

  removeFile: (id: string) => void;

  quickAnalyzeFile: (
    file: SecurityFile
  ) => void;
}


const AppContext =
  createContext<AppContextType | undefined>(
    undefined
  );


const defaultStages: PipelineStage[] = [
  {
    id: '1',
    label: 'Waiting for investigation',
    status: 'idle',
  },
  {
    id: '2',
    label: 'Security Context Identification',
    status: 'idle',
  },
  {
    id: '3',
    label: 'Agent Intelligence Selection',
    status: 'idle',
  },
  {
    id: '4',
    label: 'Security Analysis',
    status: 'idle',
  },
  {
    id: '5',
    label: 'Generating Security Report',
    status: 'idle',
  },
];


/*
============================================
REMOVE OLD FAKE BACKEND REPORTS
============================================
*/

const cleanOldInvestigations = (
  data: Investigation[]
): Investigation[] => {

  return data.map(
    (investigation) => ({
      ...investigation,

      messages:
        investigation.messages.map(
          (message: any) => {

            const isOldFakeReport =
              message?.structuredFinding?.simpleExplanation ===
              'The request was received, but CyberSphere could not retrieve the final analysis from the backend.';

            if (isOldFakeReport) {

              const {
                structuredFinding,
                ...cleanMessage
              } = message;

              return cleanMessage;
            }

            return message;
          }
        ),
    })
  );
};


export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {


  /*
  ============================================
  USER AUTHENTICATION
  ============================================
  */

  const [user, setUser] =
    useState<UserProfile | null>(null);


  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(false);


  /*
  ============================================
  INVESTIGATIONS
  ============================================
  */

  const [investigations, setInvestigations] =
    useState<Investigation[]>([]);


  const [
    currentInvestigationId,
    setCurrentInvestigationId,
  ] = useState<string | null>(null);


  /*
  ============================================
  UPLOADED FILES
  ============================================
  */

  const [files, setFiles] =
    useState<SecurityFile[]>([]);


  /*
  ============================================
  ANALYSIS STATE
  ============================================
  */

  const [isAnalyzing, setIsAnalyzing] =
    useState<boolean>(false);


  const [
    pipelineStages,
    setPipelineStages,
  ] =
    useState<PipelineStage[]>(
      defaultStages
    );


  const [
    activeAgent,
    setActiveAgent,
  ] =
    useState<AgentType>(
      'CyberSphere Orchestrator'
    );


  /*
  ============================================
  FRESH SESSION ON EVERY APP LOAD
  ============================================

  CyberSphere currently uses in-memory session data.

  - No account session is restored automatically
  - No investigations are restored automatically
  - No uploaded files are restored automatically
  - Legacy localStorage data is cleared once
  - Refreshing/restarting the frontend returns to a fresh state
  */

  useEffect(() => {

    const legacyKeys = [
      'cybersphere_v2_user',
      'cybersphere_v2_authenticated',
      'cybersphere_v2_investigations',
      'cybersphere_v2_current_investigation',
      'cybersphere_v2_files',
    ];

    legacyKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

  }, []);


  /*
  ============================================
  CURRENT INVESTIGATION
  ============================================
  */

  const currentInvestigation =
    investigations.find(
      (inv) =>
        inv.id === currentInvestigationId
    ) || null;


  /*
  ============================================
  LOGIN
  ============================================
  */

  const login = (
    email: string,
    _pass: string
  ) => {

    const username =
      email.split('@')[0] ||
      'Cyber Operator';


    const formattedName =
      username
        .replace(/[._-]/g, ' ')
        .replace(
          /\b\w/g,
          (char) =>
            char.toUpperCase()
        );


    setUser({

      name:
        formattedName,

      email,

      role:
        'CyberSphere Operator',

      securityClearance:
        'Authorized User',

    });


    setIsAuthenticated(true);

  };


  /*
  ============================================
  LOGOUT
  ============================================
  */

  const logout = () => {

    setUser(null);

    setIsAuthenticated(false);

    setInvestigations([]);

    setFiles([]);

    setCurrentInvestigationId(null);

    setIsAnalyzing(false);

    setPipelineStages(defaultStages);

    setActiveAgent(
      'CyberSphere Orchestrator'
    );

  };


  /*
  ============================================
  CREATE NEW INVESTIGATION
  ============================================
  */

  const createNewInvestigation = (
    title?: string,
    initialPrompt?: string,
    category: any = 'soc'
  ): string => {

    const newId =
      `inv-${Date.now()}`;


    const classification =
      initialPrompt
        ? classifyInput(initialPrompt)
        : null;


    const investigationTitle =
      title ||
      (
        initialPrompt
          ? initialPrompt
              .slice(0, 50)
              .trim()
          : 'New Cybersecurity Investigation'
      );


    const assignedAgent =
      classification?.recommendedAgent ||
      'CyberSphere Orchestrator';


    const newInvestigation:
      Investigation = {

      id:
        newId,

      title:
        investigationTitle,

      agent:
        assignedAgent,

      riskLevel:
        'INFO',

      status:
        'in_progress',

      timestamp:
        'Just now',

      updatedAt:
        new Date().toISOString(),

      snippet:
        initialPrompt
          ? initialPrompt.slice(
              0,
              100
            )
          : 'CyberSphere investigation workspace created.',

      category:
        category ||
        (
          classification?.type === 'code'
            ? 'code'
            : classification?.type ===
              'threat_indicator'
            ? 'threat'
            : 'soc'
        ),

      messages:
        initialPrompt
          ? [
              {

                id:
                  `msg-${Date.now()}`,

                sender:
                  'user',

                timestamp:
                  new Date()
                    .toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    ),

                message:
                  initialPrompt,

                detectedType:
                  classification?.label,

              },
            ]
          : [],

    };


    setInvestigations(
      (prev) => [
        newInvestigation,
        ...prev,
      ]
    );


    setCurrentInvestigationId(
      newId
    );


    /*
    Automatically analyze
    initial prompt
    */

    if (initialPrompt) {

      setTimeout(() => {

        executeAnalysisFlow(
          newId,
          initialPrompt
        );

      }, 100);

    }


    return newId;

  };


  /*
  ============================================
  MAIN CYBERSPHERE ANALYSIS FLOW
  ============================================
  */

  const executeAnalysisFlow =
    async (
      targetInvId: string,
      messageText: string,
      attachedFile?: SecurityFile | null
    ):
      Promise<ChatMessage | null> => {


      setIsAnalyzing(true);


      /*
      Determine actual content
      */

      const fileContent =
        attachedFile?.previewContent ||
        '';


      const analysisText =
        fileContent ||
        messageText;


      const classification =
        classifyInput(
          analysisText,
          attachedFile?.name
        );


      setActiveAgent(
        classification.recommendedAgent
      );


      /*
      ========================================
      PIPELINE STEP 1
      ========================================
      */

      setPipelineStages([

        {
          id: '1',
          label:
            'Request Received',
          status:
            'completed',
        },

        {
          id: '2',
          label:
            'Understanding Security Context',
          status:
            'active',
          detail:
            classification.label,
        },

        {
          id: '3',
          label:
            'Selecting Security Agent',
          status:
            'waiting',
        },

        {
          id: '4',
          label:
            'Security Analysis',
          status:
            'waiting',
        },

        {
          id: '5',
          label:
            'Preparing Security Report',
          status:
            'waiting',
        },

      ]);


      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            350
          )
      );


      /*
      ========================================
      PIPELINE STEP 2
      ========================================
      */

      setPipelineStages([

        {
          id: '1',
          label:
            'Request Received',
          status:
            'completed',
        },

        {
          id: '2',
          label:
            classification.label,
          status:
            'completed',
        },

        {
          id: '3',
          label:
            `${classification.recommendedAgent} Activated`,
          status:
            'active',
          agent:
            classification.recommendedAgent,
        },

        {
          id: '4',
          label:
            'Security Analysis',
          status:
            'waiting',
        },

        {
          id: '5',
          label:
            'Preparing Security Report',
          status:
            'waiting',
        },

      ]);


      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            350
          )
      );


      /*
      ========================================
      PIPELINE STEP 3
      ========================================
      */

      setPipelineStages([

        {
          id: '1',
          label:
            'Request Received',
          status:
            'completed',
        },

        {
          id: '2',
          label:
            classification.label,
          status:
            'completed',
        },

        {
          id: '3',
          label:
            `${classification.recommendedAgent} Activated`,
          status:
            'completed',
        },

        {
          id: '4',
          label:
            'Analyzing Security Data',
          status:
            'active',
        },

        {
          id: '5',
          label:
            'Preparing Security Report',
          status:
            'waiting',
        },

      ]);


      /*
      ========================================
      BACKEND REQUEST
      ========================================
      */

      let apiResponseData:
        any = null;

      let backendError =
        false;


      try {

        const response =
          await fetch(
            '/api/chat',
            {

              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({

                  message:
                    messageText ||
                    (
                      attachedFile
                        ? `Analyze uploaded file: ${attachedFile.name}`
                        : ''
                    ),

                  log_data:
                    classification.type === 'log'
                      ? analysisText
                      : null,

                  code_data:
                    classification.type === 'code'
                      ? analysisText
                      : null,

                }),

            }
          );


        if (!response.ok) {

          throw new Error(
            `Backend returned ${response.status}`
          );

        }


        apiResponseData =
          await response.json();


      } catch (error) {

        console.error(
          'CyberSphere backend error:',
          error
        );

        backendError =
          true;

      }


      /*
      ========================================
      PIPELINE COMPLETE
      ========================================
      */

      setPipelineStages([

        {
          id: '1',
          label:
            'Request Received',
          status:
            'completed',
        },

        {
          id: '2',
          label:
            classification.label,
          status:
            'completed',
        },

        {
          id: '3',
          label:
            `${
              apiResponseData?.agent ||
              classification.recommendedAgent
            } Completed`,
          status:
            'completed',
        },

        {
          id: '4',
          label:
            'Security Analysis Complete',
          status:
            'completed',
        },

        {
          id: '5',
          label:
            'Security Report Generated',
          status:
            'completed',
        },

      ]);


      /*
      ========================================
      ASSISTANT RESPONSE

      IMPORTANT:
      structuredFinding is added ONLY
      when backend actually sends it.

      No fake backend unavailable report.
      ========================================
      */

      const assistantMsg:
        ChatMessage = {

        id:
          `msg-${Date.now()}`,

        sender:
          'assistant',

        timestamp:
          new Date()
            .toLocaleTimeString(
              [],
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            ),

        message:

          apiResponseData?.reply ||

          (
            backendError
              ? 'CyberSphere could not connect to the backend. Please ensure the CyberSphere backend is running and try again.'
              : 'CyberSphere completed the request, but no response message was returned.'
          ),


        agent:

          apiResponseData?.agent ||

          classification.recommendedAgent,


        status:

          apiResponseData?.status ||

          {
            orchestrator:
              'completed',

            soc:
              'waiting',

            threat:
              'waiting',

            mitre:
              'waiting',

          },

      };


      /*
      ========================================
      ADD STRUCTURED REPORT ONLY IF
      BACKEND ACTUALLY RETURNS ONE
      ========================================
      */

      if (
        apiResponseData?.structuredFinding
      ) {

        assistantMsg.structuredFinding =
          apiResponseData.structuredFinding;

      }


      /*
      ========================================
      SAVE ASSISTANT RESPONSE
      ========================================
      */

      setInvestigations(
        (prev) =>
          prev.map(
            (inv) => {

              if (
                inv.id ===
                targetInvId
              ) {

                return {

                  ...inv,

                  agent:
                    assistantMsg.agent ||
                    inv.agent,

                  riskLevel:
                    assistantMsg
                      .structuredFinding
                      ?.riskLevel ||
                    inv.riskLevel,

                  status:
                    'completed',

                  snippet:
                    assistantMsg.message
                      .slice(
                        0,
                        110
                      ),

                  updatedAt:
                    new Date()
                      .toISOString(),

                  messages:
                    [
                      ...inv.messages,
                      assistantMsg,
                    ],

                };

              }


              return inv;

            }
          )
      );


      setIsAnalyzing(false);


      return assistantMsg;

    };


  /*
  ============================================
  SEND MESSAGE
  ============================================
  */

  const sendMessage =
    async (
      text: string,
      attachedFile?: SecurityFile | null
    ):
      Promise<ChatMessage | null> => {


      if (
        !text.trim() &&
        !attachedFile
      ) {

        return null;

      }


      let targetInvId =
        currentInvestigationId;


      /*
      Create fresh chat
      if none exists
      */

      if (!targetInvId) {

        targetInvId =
          `inv-${Date.now()}`;


        const classification =
          classifyInput(
            text ||
            attachedFile?.previewContent ||
            '',
            attachedFile?.name
          );


        const newInvestigation:
          Investigation = {

          id:
            targetInvId,

          title:
            text
              ? text
                  .slice(0, 50)
              : `Investigation: ${attachedFile?.name}`,

          agent:
            classification.recommendedAgent,

          riskLevel:
            'INFO',

          status:
            'in_progress',

          timestamp:
            'Just now',

          updatedAt:
            new Date().toISOString(),

          snippet:
            text ||
            `Analyzing ${attachedFile?.name}`,

          category:
            classification.type === 'code'
              ? 'code'
              : classification.type ===
                'threat_indicator'
              ? 'threat'
              : 'soc',

          messages:
            [],

        };


        setInvestigations(
          (prev) => [
            newInvestigation,
            ...prev,
          ]
        );


        setCurrentInvestigationId(
          targetInvId
        );

      }


      const classification =
        classifyInput(
          text ||
          attachedFile?.previewContent ||
          '',
          attachedFile?.name
        );


      const userMsg:
        ChatMessage = {

        id:
          `msg-${Date.now()}`,

        sender:
          'user',

        timestamp:
          new Date()
            .toLocaleTimeString(
              [],
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            ),

        message:

          text ||

          `Please analyze uploaded file: ${attachedFile?.name}`,


        detectedType:
          classification.label,


        attachments:

          attachedFile
            ? [

                {

                  name:
                    attachedFile.name,

                  size:
                    attachedFile.size,

                  type:
                    attachedFile.type,

                },

              ]
            : undefined,

      };


      setInvestigations(
        (prev) =>
          prev.map(
            (inv) => {

              if (
                inv.id ===
                targetInvId
              ) {

                return {

                  ...inv,

                  messages:
                    [
                      ...inv.messages,
                      userMsg,
                    ],

                  status:
                    'in_progress',

                  snippet:
                    userMsg.message
                      .slice(
                        0,
                        100
                      ),

                };

              }


              return inv;

            }
          )
      );


      return executeAnalysisFlow(
        targetInvId,
        text,
        attachedFile
      );

    };


  /*
  ============================================
  ADD FILE
  ============================================
  */

  const addFile = (
    fileData:
      Omit<
        SecurityFile,
        'id'
      >
  ): SecurityFile => {


    const newFile:
      SecurityFile = {

      ...fileData,

      id:
        `file-${Date.now()}`,

    };


    setFiles(
      (prev) => [
        newFile,
        ...prev,
      ]
    );


    return newFile;

  };


  /*
  ============================================
  REMOVE FILE
  ============================================
  */

  const removeFile = (
    id: string
  ) => {

    setFiles(
      (prev) =>
        prev.filter(
          (file) =>
            file.id !== id
        )
    );

  };


  /*
  ============================================
  QUICK FILE ANALYSIS
  ============================================
  */

  const quickAnalyzeFile = (
    file: SecurityFile
  ) => {

    const prompt =
      file.previewContent ||

      `Please analyze this uploaded file for cybersecurity risks: ${file.name}`;


    createNewInvestigation(
      `Investigation: ${file.name}`,
      prompt
    );

  };


  /*
  ============================================
  PROVIDER
  ============================================
  */

  return (

    <AppContext.Provider

      value={{

        user,

        isAuthenticated,

        investigations,

        currentInvestigationId,

        currentInvestigation,

        files,

        isAnalyzing,

        pipelineStages,

        activeAgent,

        login,

        logout,

        setCurrentInvestigationId,

        createNewInvestigation,

        sendMessage,

        addFile,

        removeFile,

        quickAnalyzeFile,

      }}

    >

      {children}

    </AppContext.Provider>

  );

};


export const useApp = () => {

  const context =
    useContext(
      AppContext
    );


  if (!context) {

    throw new Error(
      'useApp must be used within an AppProvider'
    );

  }


  return context;

};