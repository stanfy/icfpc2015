//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "ArgumentsParser.h"
#import "CommandLineTask.h"


@implementation ArgumentsParser {

}
- (instancetype)initWithArguments:(NSArray *)arguments {
    self = [super init];
    if (self) {
        _arguments = arguments;
    }

    return self;
}

+ (instancetype)parserWithArguments:(NSArray *)arguments {
    return [[self alloc] initWithArguments:arguments];
}

- (CommandLineTask *)taskFromArguments {

    NSString *path = @"";
    NSMutableArray *words = [NSMutableArray array];
    double timeLimit = 0;
    double memoryLimit = 0.0;

    BOOL foundPath = NO;
    BOOL foundPower = NO;
    BOOL foundTime = NO;
    BOOL foundMemory = NO;

    for (NSString *argument in self.arguments) {
        if (argument == self.arguments[0]) {
            continue;
        }
        if (foundPath) {
            path = argument;
            foundPath = NO;
            continue;
        }
        if (foundPower) {
            [words addObject:argument];
            foundPower = NO;
            continue;
        }
        if (foundTime) {
            timeLimit = [argument doubleValue];
            foundTime = NO;
            continue;
        }

        if (foundMemory) {
            memoryLimit = [argument doubleValue];
            foundMemory = NO;
            continue;
        }

        if ([argument isEqualToString:@"-f"]) {
            foundPath = YES;
            continue;
        }
        if ([argument isEqualToString:@"-p"]) {
            foundPower = YES;
            continue;
        }
        if ([argument isEqualToString:@"-t"]) {
            foundTime = YES;
            continue;
        }
        if ([argument isEqualToString:@"-m"]) {
            foundMemory = YES;
            continue;
        }

        NSCAssert(false, @"Unknown parameter %@", argument);
    }

    CommandLineTask *task = [CommandLineTask taskWithFilePath:path powerWords:words limit:timeLimit maxMemoryUsage:memoryLimit];
    return task;
}


@end