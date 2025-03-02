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

export default function Marksheet({ reportData, name, prn }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  return (
    <div className="p-4 items-center ">
      <Card className=" ">
        <CardHeader>
          <CardTitle>Student Report Card</CardTitle>
          <CardDescription>Exam Results and Feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{name}</h2>
            <p className="text-gray-600 mb-2">PRN : {prn}</p>
            <Badge variant="secondary" className="text-lg">
              Score: {reportData.obtained_marks} / {reportData.total_marks}
            </Badge>
          </div>

          <ScrollArea className="rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700">
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
                {reportData.questions.map((q, idx) => (
                  <TableRow key={idx}>
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
