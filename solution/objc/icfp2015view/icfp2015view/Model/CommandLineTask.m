//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "CommandLineTask.h"


@implementation CommandLineTask {

}
- (instancetype)initWithFilePath:(NSString *)filePath powerWords:(NSArray *)powerWords limit:(double)limit maxMemoryUsage:(double)maxMemoryUsage {
    self = [super init];
    if (self) {
        _filePath = filePath;
        _powerWords = powerWords;
        _limit = limit;
        _maxMemoryUsage = maxMemoryUsage;
    }

    return self;
}

+ (instancetype)taskWithFilePath:(NSString *)filePath powerWords:(NSArray *)powerWords limit:(double)limit maxMemoryUsage:(double)maxMemoryUsage {
    return [[self alloc] initWithFilePath:filePath powerWords:powerWords limit:limit maxMemoryUsage:maxMemoryUsage];
}

- (NSString *)description {
    NSMutableString *description = [NSMutableString stringWithFormat:@"<%@: ", NSStringFromClass([self class])];
    [description appendFormat:@"  filePath=%@", self.filePath];
    [description appendFormat:@", powerWords=%@", self.powerWords];
    [description appendFormat:@", limit=%f", self.limit];
    [description appendFormat:@", maxMemoryUsage=%f", self.maxMemoryUsage];
    [description appendString:@">"];
    return description;
}


@end