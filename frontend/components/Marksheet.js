"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// const reportData = {
//   total_marks: 30,
//   obtained_marks: 20,
//   student_name: "Amey Kulkarni",
//   student_prn: "12320091",
//   questions: [
//     {
//       qno: 1,
//       question: "Define operating system.",
//       marks: 2,
//       model_answer:
//         "Operating system is a system software that manages computer hardware, software resources and provides common services for computer programs.",
//       student_answer: "Operating system is a interface between user and computer.",
//       marks_obtained: 1,
//       feedback: "Good attempt. But you missed some points.",
//     },
//     {
//       qno: 2,
//       question: "What is the difference between process and thread?",
//       marks: 3,
//       model_answer:
//         "A process is a program in execution. A thread is a subset of a process. A process can have multiple threads.",
//       student_answer:
//         "Process is a program in execution. Thread is a subset of a process.",
//       marks_obtained: 2,
//       feedback: "Good attempt. But you missed some points.",
//     },
//     {
//       qno: 3,
//       question: "What is deadlock?",
//       marks: 5,
//       model_answer:
//         "Deadlock is a situation where two or more processes are waiting for each other to release resources.",
//       student_answer:
//         "Deadlock is a situation where two or more processes are waiting for each other to release resources.",
//       marks_obtained: 5,
//       feedback: "Good attempt.",
//     },
//     {
//       qno: 4,
//       question: "What is virtual memory?",
//       marks: 5,
//       model_answer:
//         "Virtual memory is a memory management technique that provides an idealized abstraction of the storage resources that are actually available on a given machine.",
//       student_answer:
//         "Virtual memory is a memory management technique that provides an idealized abstraction of the storage resources that are actually available on a given machine.",
//       marks_obtained: 5,
//       feedback: "Good attempt.",
//     },
//     {
//       qno: 5,
//       question: "What is a semaphore?",
//       marks: 5,
//       model_answer:
//         "A semaphore is a variable or abstract data type used to control access to a common resource by multiple processes in a concurrent system.",
//       student_answer:
//         "A semaphore is a variable or abstract data type used to control access to a common resource by multiple processes in a concurrent system.",
//       marks_obtained: 5,
//       feedback: "Good attempt.",
//     },
//   ],
// };

export default function Marksheet({reportData}) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  return (
    <div className="container mx-auto p-4 items-center ">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Student Report Card</CardTitle>
          <CardDescription>Exam Results and Feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Heramb Bhoodhar</h2>
            <p className="text-gray-600 mb-2">PRN : 12320041</p>
            <Badge variant="secondary" className="text-lg">
              Score: {reportData.obtained_marks} / {reportData.total_marks}
            </Badge>
          </div>

          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Q.No</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-[100px]">Marks</TableHead>
                  <TableHead className="w-[100px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.questions.map((q) => (
                  <TableRow key={q.qno}>
                    <TableCell className="font-medium">{q.qno}</TableCell>
                    <TableCell>{q.question}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          q.marks_obtained === q.marks ? "success" : "destructive"
                        }
                      >
                        {q.marks_obtained} / {q.marks}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuestion(q)}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[800px] w-full">
                          <DialogHeader>
                            <DialogTitle>Question {q.qno} Details</DialogTitle>
                            <DialogDescription>
                              Review your answer, the model answer, and feedback.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Your Answer:</span>
                              <p className="col-span-3">{q.student_answer}</p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Model Answer:</span>
                              <p className="col-span-3">{q.model_answer}</p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Feedback:</span>
                              <p className="col-span-3">{q.feedback}</p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Marks:</span>
                              <Badge
                                variant={
                                  q.marks_obtained === q.marks
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {q.marks_obtained} / {q.marks}
                              </Badge>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
