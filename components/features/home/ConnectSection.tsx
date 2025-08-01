"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fanLinks, officialLinks } from "@/utils/lib/constants/social-links";

export function ConnectSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-ado-key/5 py-20 sm:items-center">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center text-4xl leading-tight font-black text-foreground uppercase md:text-6xl"
        >
          Adomination
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground md:text-2xl"
        >
          Follow official accounts or join vibrant fan communities to celebrate
          together while supporting Ado's music!
        </motion.p>

        <Tabs defaultValue="official" className="mx-auto w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center"
          >
            <TabsList className="inline-flex h-14 items-center justify-center p-2">
              <TabsTrigger
                value="official"
                className="text-md rounded-lg px-5 py-2 font-semibold transition-all data-[state=active]:bg-ado-key/80 data-[state=active]:text-white"
              >
                Official
              </TabsTrigger>
              <TabsTrigger
                value="fan"
                className="text-md rounded-lg px-5 py-2 font-semibold transition-all data-[state=active]:bg-ado-key/80 data-[state=active]:text-white"
              >
                Fan Communities
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="official" className="mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {officialLinks.map((link) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Card className="flex h-full flex-col justify-between overflow-hidden border-ado-key/20 bg-card shadow-sm transition-colors hover:border-ado-key/40 hover:bg-card/90 hover:shadow-md">
                      <CardHeader className="flex flex-col gap-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {link.icon}
                          <span className="break-words">{link.name}</span>
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {link.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fan" className="mt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fanLinks.map((link) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Card className="flex h-full flex-col justify-between overflow-hidden border-ado-key/20 bg-card shadow-sm transition-colors hover:border-ado-key/40 hover:bg-card/90 hover:shadow-md">
                      <CardHeader className="flex flex-col gap-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {link.icon}
                          <span className="break-words">{link.name}</span>
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {link.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
