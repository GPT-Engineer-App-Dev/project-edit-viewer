import React, { useState } from "react";
import { Box, Button, Heading, Select, Text, Textarea, VStack } from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectEdits, setProjectEdits] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const rows = csv.split("\n").slice(1); // Skip header row
      const data = rows.map((row) => {
        const [path, id, created, updated, codeBlocks, commitSha, createdAt, createdBy, errorMessage, errorType, editId, messages, numOfEdits, number, prompt, response, revertTargetEditId, reverted, screenshotUrl, status, tags, type] = row.split("\t");
        return {
          path,
          id,
          created,
          updated,
          codeBlocks,
          commitSha,
          createdAt,
          createdBy,
          errorMessage,
          errorType,
          editId,
          messages,
          numOfEdits,
          number,
          prompt,
          response,
          revertTargetEditId,
          reverted,
          screenshotUrl,
          status,
          tags: JSON.parse(tags),
          type,
        };
      });
      setCsvData(data);
    };
    reader.readAsText(file);
  };

  const handleProjectChange = (event) => {
    const projectId = event.target.value;
    setSelectedProject(projectId);
    const edits = csvData.filter((row) => row.path.startsWith(`projects/${projectId}/edits/`) && row.type === "ai_update").sort((a, b) => new Date(a.created) - new Date(b.created));
    setProjectEdits(edits);
  };

  const uniqueProjects = [...new Set(csvData.map((row) => row.path.split("/")[1]))];

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Project Data Viewer
      </Heading>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Text mb={2}>Upload CSV file:</Text>
          <Button leftIcon={<FaUpload />}>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
          </Button>
        </Box>
        {csvData.length > 0 && (
          <Box>
            <Text mb={2}>Select project:</Text>
            <Select value={selectedProject} onChange={handleProjectChange}>
              <option value="">-- Select Project --</option>
              {uniqueProjects.map((projectId) => (
                <option key={projectId} value={projectId}>
                  {projectId}
                </option>
              ))}
            </Select>
          </Box>
        )}
        {projectEdits.length > 0 && (
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Edits for Project {selectedProject}
            </Heading>
            {projectEdits.map((edit) => (
              <Box key={edit.id} p={4} borderWidth={1} mb={4}>
                <Text>
                  <strong>Created:</strong> {edit.createdAt}
                </Text>
                <Text>
                  <strong>Created By:</strong> {edit.createdBy}
                </Text>
                <Text>
                  <strong>Status:</strong> {edit.status}
                </Text>
                {edit.status !== "failed" && (
                  <Text>
                    <strong>Commit SHA:</strong> {edit.commitSha}
                  </Text>
                )}
                <Text mt={2}>
                  <strong>Output:</strong>
                </Text>
                <Textarea value={JSON.stringify(edit.tags.output, null, 2)} isReadOnly height="200px" />
              </Box>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Index;
