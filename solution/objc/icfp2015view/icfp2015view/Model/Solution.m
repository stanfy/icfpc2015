//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "Solution.h"


@interface Solution ()
@property (nonatomic, readwrite) NSNumber * problemId;
@property (nonatomic, readwrite) NSNumber * seed;
@property (nonatomic, readwrite) NSString * tag;
@property (nonatomic, readwrite) NSString * commands;
@end


@implementation Solution {

}
- (instancetype)initWithProblemId:(NSNumber *)problemId seed:(NSNumber *)seed tag:(NSString *)tag commands:(NSString *)commands {
    self = [super init];
    if (self) {
        self.problemId = problemId;
        self.seed = seed;
        self.tag = tag;
        self.commands = commands;
    }

    return self;
}


+ (instancetype)solutionWithProblemId:(NSNumber *)problemId seed:(NSNumber *)seed tag:(NSString *)tag commands:(NSString *)commands {
    return [[self alloc] initWithProblemId:problemId seed:seed tag:tag commands:commands];
}


- (NSString * )jsonString {
    NSDictionary * dictionary = [self jsonDictionary];

    if ([NSJSONSerialization isValidJSONObject:dictionary]) {

        NSError * error;
        NSData * data = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:&error];

        if (data && !error) {
            NSString * jsonString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            return jsonString;
        }
    }
    return nil;
}


- (NSDictionary *)jsonDictionary {
    NSDictionary * dictionary = @{
        @"problemId" : self.problemId,
        @"seed" : self.seed,
        @"tag" : self.tag,
        @"solution" : self.commands
    };
    return dictionary;
}


- (NSString *)description {
    NSMutableString * description = [NSMutableString stringWithFormat:@"<%@: ", NSStringFromClass([self class])];
    [description appendFormat:@"self.problemId=%@", self.problemId];
    [description appendFormat:@", self.seed=%@", self.seed];
    [description appendFormat:@", self.tag=%@", self.tag];
    [description appendFormat:@", self.commands=%@", self.commands];
    [description appendString:@">"];
    return description;
}

@end